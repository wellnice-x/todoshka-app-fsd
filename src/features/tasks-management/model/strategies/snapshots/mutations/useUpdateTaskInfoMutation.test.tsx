import type { Task } from "@/entities/task";

import { QUERY_KEY } from "../queryKeys";
import { useUpdateTaskInfoMutation } from "./useUpdateTaskInfoMutation";
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

describe("useUpdateTaskInfoMutation Snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("updates task info", async () => {
    queryClient.setQueryData<Task[]>(QUERY_KEY, [
      {
        id: "0",
        title: "Old title",
        description: "Old description",
        isDone: false,
        orderIndex: 0,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useUpdateTaskInfoMutation(), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        taskId: "0",
        title: "New title",
        description: "New description",
      });
    });

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks[0].title).toBe("New title");
    expect(tasks[0].description).toBe("New description");
  });

  it("rolls back task info when request fails", async () => {
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
        title: "Old title",
        description: "Old description",
        isDone: false,
        orderIndex: 0,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useUpdateTaskInfoMutation(), {
      wrapper,
    });

    const mutationPromise = result.current
      .mutateAsync({
        taskId: "0",
        title: "New title",
        description: "New description",
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks[0].title).toBe("New title");
      expect(tasks[0].description).toBe("New description");
    });

    await mutationPromise;

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks[0].title).toBe("Old title");
      expect(tasks[0].description).toBe("Old description");
    });
  });

  it("doesn't roll back when network error occurs", async () => {
    server.use(http.patch("*/tasks", () => HttpResponse.error()));

    queryClient.setQueryData<Task[]>(QUERY_KEY, [
      {
        id: "0",
        title: "Old title",
        description: "Old description",
        isDone: false,
        orderIndex: 0,
        createdAt: new Date(),
      },
    ]);

    const { result } = renderHook(() => useUpdateTaskInfoMutation(), {
      wrapper,
    });

    await result.current
      .mutateAsync({
        taskId: "0",
        title: "New title",
        description: "New description",
      })
      .catch(() => {});

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks[0].title).toBe("New title");
    expect(tasks[0].description).toBe("New description");
  });
});
