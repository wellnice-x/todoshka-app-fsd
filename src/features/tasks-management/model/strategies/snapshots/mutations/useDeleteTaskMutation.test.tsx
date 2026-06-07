import type { Task } from "@/entities/task";

import { QUERY_KEY } from "../queryKeys";
import { useDeleteTaskMutation } from "./useDeleteTaskMutation";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { delay, http, HttpResponse } from "msw";
import { server } from "@tests/msw/server";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

vi.mock(
  "@/features/tasks-management/model/strategies/snapshots/runtime/useStrategyRuntime",
  () => ({
    useStrategyRuntime: () => ({
      queryClient,
      isServerAccessBlocked: false,
      isServerAccessUncertain: false,
      hasConnectionJustRecovered: false,
      scheduleQuerySync: vi.fn(),
      syncWithOptionalToast: vi.fn(),
      handleSync: vi.fn(),
    }),
  }),
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useDeleteTaskMutation Snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("removes task", async () => {
    queryClient.setQueryData<Task[]>(QUERY_KEY, [
      {
        id: "0",
        title: "First task",
        description: "",
        isDone: false,
        orderIndex: 0,
        createdAt: new Date(),
      },
      {
        id: "1",
        title: "Second task",
        description: "",
        isDone: false,
        orderIndex: 1,
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Third task",
        description: "",
        isDone: false,
        orderIndex: 2,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useDeleteTaskMutation(), {
      wrapper,
    });

    result.current
      .mutateAsync({
        taskId: "1",
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks).toHaveLength(2);

      expect(tasks.map((task) => task.id)).toEqual(["0", "2"]);
    });
  });

  it("roll backs deleted tasks in correct order when request fails", async () => {
    server.use(
      http.delete("*/tasks", async () => {
        await delay(100);

        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    queryClient.setQueryData<Task[]>(QUERY_KEY, [
      {
        id: "0",
        title: "First task",
        description: "",
        isDone: false,
        orderIndex: 0,
        createdAt: new Date(),
      },
      {
        id: "1",
        title: "Second task",
        description: "",
        isDone: false,
        orderIndex: 1,
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Third task",
        description: "",
        isDone: false,
        orderIndex: 2,
        createdAt: new Date(),
      },
      {
        id: "3",
        title: "Fourth task",
        description: "",
        isDone: false,
        orderIndex: 3,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useDeleteTaskMutation(), {
      wrapper,
    });

    result.current
      .mutateAsync({
        taskId: "2",
      })
      .catch(() => {});

    result.current
      .mutateAsync({
        taskId: "3",
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks).toHaveLength(2);
    });

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks).toHaveLength(4);

      expect(tasks.map((task) => task.id)).toEqual(["0", "1", "2", "3"]);
    });
  });

  it("doesn't roll back when network error occurs", async () => {
    server.use(
      http.delete("*/tasks", () => {
        return HttpResponse.error();
      }),
    );

    queryClient.setQueryData<Task[]>(QUERY_KEY, [
      {
        id: "0",
        title: "First task",
        description: "",
        isDone: false,
        orderIndex: 0,
        createdAt: new Date(),
      },
      {
        id: "1",
        title: "Second task",
        description: "",
        isDone: false,
        orderIndex: 1,
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Third task",
        description: "",
        isDone: false,
        orderIndex: 2,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useDeleteTaskMutation(), {
      wrapper,
    });

    const mutationPromise = result.current
      .mutateAsync({
        taskId: "1",
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks.map((task) => task.id)).toEqual(["0", "2"]);
    });

    await mutationPromise;

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks.map((task) => task.id)).toEqual(["0", "2"]);
  });
});
