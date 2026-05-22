import type { QueryClient } from "@tanstack/react-query";
import type { Task } from "@/entities/task";

export type HandleSyncFn = (
  syncPromise: Promise<void> | undefined,
) => Promise<void>;

export const createHandleSync = (
  queryClient: QueryClient,
  optimisticMode: string,
): HandleSyncFn => {
  const removeOptimisticTasks = () => {
    queryClient.setQueryData<Task[]>(
      ["tasks", optimisticMode],
      (old = []) =>
        old.filter((task) => !task.id.startsWith("optimistic-")),
    );
  };

  return async (syncPromise) => {
    if (!syncPromise) return;

    try {
      await syncPromise;
    } catch {
      removeOptimisticTasks();
    }
  };
};