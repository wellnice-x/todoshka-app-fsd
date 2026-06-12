import type { Task } from "@/entities/task";

import { QUERY_KEY } from "../queryKeys";
import { useToggleTaskMutation } from "./useToggleTaskMutation";
import { renderHook, waitFor, act } from "@testing-library/react";
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

describe("useToggleTaskMutation Snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("toggles task", async () => {
    server.use(
      http.patch("*/tasks", async () => {
        await delay(100);

        return HttpResponse.json([
          {
            id: "0",
            title: "title",
            description: "",
            is_done: true,
            order_index: 0,
            created_at: new Date().toISOString(),
          },
        ]);
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
    ]);

    const { result } = renderHook(() => useToggleTaskMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        taskId: "0",
        newIsDone: true,
      });
    });

    await act(async () => {
      await result.current.mutateAsync({
        taskId: "1",
        newIsDone: false,
      });
    });

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks.map((task) => task.isDone)).toEqual([true, false]);
  });

  it("replaces optimistic task with server task", async () => {
    server.use(
      http.patch("*/tasks", async () => {
        await delay(100);

        return HttpResponse.json([
          {
            id: "0",
            title: "Updated by server",
            description: "",
            is_done: true,
            order_index: 0,
            created_at: new Date().toISOString(),
          },
        ]);
      }),
    );

    queryClient.setQueryData<Task[]>(QUERY_KEY, [
      {
        id: "0",
        title: "Optimistic task",
        description: "",
        isDone: false,
        orderIndex: 0,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useToggleTaskMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        taskId: "0",
        newIsDone: true,
      });
    });

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks[0].title).toBe("Updated by server");
  });

  it("rolls back task completion when request fails", async () => {
    server.use(
      http.patch("*/tasks", async () => {
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
    ]);

    const { result } = renderHook(() => useToggleTaskMutation(), {
      wrapper,
    });

    const mutationPromise = result.current
      .mutateAsync({
        taskId: "0",
        newIsDone: true,
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks[0].isDone).toBe(true);
    });

    await mutationPromise;

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks[0].isDone).toBe(false);
    });
  });

  it("doesn't roll back when network error occurs", async () => {
    server.use(
      http.patch("*/tasks", () => {
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
    ]);

    const { result } = renderHook(() => useToggleTaskMutation(), {
      wrapper,
    });

    await result.current
      .mutateAsync({
        taskId: "0",
        newIsDone: false,
      })
      .catch(() => {});

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks[0].isDone).toBe(false);
  });
});
