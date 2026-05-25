import type { Task } from "@/entities/task";
import type { QueryClient, QueryKey } from "@tanstack/react-query";

export type HandleSyncFn = (
  syncPromise: Promise<void> | undefined,
) => Promise<void>;

export const createSyncHandler = (
  queryClient: QueryClient,
  queryKey: QueryKey,
): HandleSyncFn => {
  const removeOptimisticTasks = () => {
    queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
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
