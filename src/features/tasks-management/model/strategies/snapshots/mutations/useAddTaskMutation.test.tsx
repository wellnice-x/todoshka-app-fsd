import { useUIKeyStore, type Task } from "@/entities/task";

import { QUERY_KEY } from "../queryKeys";
import { useAddTaskMutation } from "./useAddTaskMutation";
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

describe("useAddTaskMutation Snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    useUIKeyStore.getState().reset();
  });

  it("adds optimistic tasks and replaces them with server tasks", async () => {
    const { result } = renderHook(() => useAddTaskMutation(), {
      wrapper,
    });

    result.current.mutateAsync({
      title: "First task",
    });

    result.current.mutateAsync({
      title: "Second task",
    });

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks).toHaveLength(2);

      expect(tasks.every((task) => task.id.startsWith("optimistic-"))).toBe(
        true,
      );
    });

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks.every((task) => task.id.startsWith("server-id-"))).toBe(true);

      expect(tasks.every((task) => task.id.startsWith("optimistic-"))).toBe(
        false,
      );
    });
  });

  it("rolls back optimistic tasks when server request fails", async () => {
    server.use(
      http.post("*/tasks", async () => {
        await delay(150);

        return new HttpResponse(null, {
          status: 500,
        });
      }),
    );

    const { result } = renderHook(() => useAddTaskMutation(), {
      wrapper,
    });

    result.current
      .mutateAsync({
        title: "First task",
      })
      .catch(() => {});

    result.current
      .mutateAsync({
        title: "Second task",
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks).toHaveLength(2);

      expect(tasks.every((task) => task.id.startsWith("optimistic-"))).toBe(
        true,
      );
    });

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks).toHaveLength(0);
    });
  });

  it("transfers ui key from optimistic task to server task", async () => {
    const { result } = renderHook(() => useAddTaskMutation(), {
      wrapper,
    });

    result.current.mutateAsync({
      title: "New task",
    });

    await waitFor(() => {
      const { uiKeyMap } = useUIKeyStore.getState();

      expect(uiKeyMap.size).toBe(1);

      const [key, value] = Array.from(uiKeyMap.entries())[0];

      expect(key.startsWith("optimistic-")).toBe(true);

      expect(value.startsWith("optimistic-")).toBe(true);
    });

    await waitFor(() => {
      const { uiKeyMap } = useUIKeyStore.getState();

      expect(uiKeyMap.size).toBe(1);

      const [key, value] = Array.from(uiKeyMap.entries())[0];

      expect(key.startsWith("server-id-")).toBe(true);

      expect(value.startsWith("optimistic-")).toBe(true);
    });
  });

  it("keeps optimistic task when network error occurs", async () => {
    server.use(
      http.post("*/tasks", () => {
        return HttpResponse.error();
      }),
    );

    const { result } = renderHook(() => useAddTaskMutation(), {
      wrapper,
    });

    result.current
      .mutateAsync({
        title: "New task",
      })
      .catch(() => {});

    await waitFor(() => {
      const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      expect(tasks).toHaveLength(1);

      expect(tasks[0].id.startsWith("optimistic-")).toBe(true);
    });

    await new Promise((resolve) => setTimeout(resolve, 150));

    const tasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

    expect(tasks).toHaveLength(1);

    expect(tasks[0].id.startsWith("optimistic-")).toBe(true);
  });
});
