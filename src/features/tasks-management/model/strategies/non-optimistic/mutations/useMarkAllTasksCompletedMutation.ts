import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/runtime/useStrategyRuntime";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/non-optimistic/config";

export const useMarkAllTasksCompletedMutation = () => {
  const { queryClient, syncWithOptionalToast } = useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("markAllTasksCompleted"),

    mutationFn: () => {
      throwIfOffline();

      return tasksUseCases.markAllTasksCompleted();
    },

    onSuccess: () => {
      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.map((task) => ({ ...task, isDone: true })),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });
};
