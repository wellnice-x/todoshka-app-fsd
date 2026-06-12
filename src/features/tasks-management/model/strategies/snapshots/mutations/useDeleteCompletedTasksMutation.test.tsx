import type { Task } from "@/entities/task";

import { QUERY_KEY } from "../queryKeys";
import { useDeleteCompletedTasksMutation } from "./useDeleteCompletedTasksMutation";
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

describe("useDeleteCompletedTasksMutation Snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("removes tasks", async () => {
    queryClient.setQueryData<Task[]>(QUERY_KEY, [
      {
        id: "0",
        title: "First task",
        description: "",
        isDone: true,
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
        isDone: true,
        orderIndex: 2,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useDeleteCompletedTasksMutation(), {
      wrapper,
    });

    result.current
      .mutateAsync({
        taskIds: ["0", "2"],
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks).toHaveLength(1);

      expect(tasks.map((task) => task.id)).toEqual(["1"]);
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
        isDone: true,
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
        isDone: true,
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

    const { result } = renderHook(() => useDeleteCompletedTasksMutation(), {
      wrapper,
    });

    result.current
      .mutateAsync({
        taskIds: ["0", "2"],
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
      expect(tasks.map((task) => task.isDone)).toEqual([
        true,
        false,
        true,
        false,
      ]);
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
        isDone: true,
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
        isDone: true,
        orderIndex: 2,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useDeleteCompletedTasksMutation(), {
      wrapper,
    });

    const mutationPromise = result.current
      .mutateAsync({
        taskIds: ["0", "2"],
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks.map((task) => task.id)).toEqual(["1"]);
    });

    await mutationPromise;

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks.map((task) => task.id)).toEqual(["1"]);
  });

  it("restores only failed tasks after partial bulk delete failure", async () => {
    const failedTaskId = "2";

    server.use(
      http.delete("*/tasks", async ({ request }) => {
        const url = new URL(request.url);

        await delay(100);

        if (url.searchParams.get("id") === `eq.${failedTaskId}`) {
          return new HttpResponse(null, { status: 500 });
        }

        return HttpResponse.json({});
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
        isDone: true,
        orderIndex: 1,
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Third task",
        description: "",
        isDone: true,
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

    const { result } = renderHook(() => useDeleteCompletedTasksMutation(), {
      wrapper,
    });

    const mutationPromise = result.current
      .mutateAsync({
        taskIds: ["1", "2"],
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks.map((task) => task.id)).toEqual(["0", "3"]);
    });

    await mutationPromise;

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks.map((task) => task.id)).toEqual(["0", "2", "3"]);
  });
});
