import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/runtime/useStrategyRuntime";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/non-optimistic/queryKeys";

export const useDeleteCompletedTasksMutation = () => {
  const { queryClient, syncWithOptionalToast } = useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("bulkDelete"),

    mutationFn: ({ taskIds }: { taskIds: string[] }) => {
      throwIfOffline();

      return tasksUseCases.deleteSome(taskIds);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.filter((task) => !vars.taskIds.includes(task.id)),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error, 0, true);
    },
  });
};
