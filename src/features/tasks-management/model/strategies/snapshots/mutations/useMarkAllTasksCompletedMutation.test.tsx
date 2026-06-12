import type { Task } from "@/entities/task";

import { QUERY_KEY } from "../queryKeys";
import { useMarkAllTasksCompletedMutation } from "./useMarkAllTasksCompletedMutation";
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

vi.mock("@/shared/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/shared/auth")>();

  return {
    ...actual,
    getCurrentUserId: vi.fn().mockResolvedValue("test-user"),
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useMarkAllTasksCompletedMutation Snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("marks all tasks completed", async () => {
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
        isDone: true,
        orderIndex: 2,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useMarkAllTasksCompletedMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks.map((task) => task.isDone)).toEqual([true, true, true]);
  });

  it("roll backs task completion when request fails", async () => {
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

    const { result } = renderHook(() => useMarkAllTasksCompletedMutation(), {
      wrapper,
    });

    const mutationPromise = result.current.mutateAsync().catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks.map((task) => task.isDone)).toEqual([true, true, true]);
    });

    await mutationPromise;

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks.map((task) => task.isDone)).toEqual([true, false, true]);
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

    const { result } = renderHook(() => useMarkAllTasksCompletedMutation(), {
      wrapper,
    });

    await result.current.mutateAsync().catch(() => {});

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks.map((task) => task.isDone)).toEqual([true, true, true]);
  });
});
