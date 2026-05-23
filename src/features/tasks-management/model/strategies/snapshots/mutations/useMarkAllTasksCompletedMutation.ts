import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { isNetworkError } from "@/shared/lib/error-utils";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/snapshots/runtime/useStrategyRuntime";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/snapshots/config";

export const useMarkAllTasksCompletedMutation = () => {
  const { queryClient, isServerAccessBlocked, syncWithOptionalToast } =
    useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("markAllCompleted"),

    mutationFn: async () => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.markAllCompleted();
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEY);

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.map((task) => ({ ...task, isDone: true })),
      );

      return { previousTasks };
    },

    onError: (error, _vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      const previousTasks = context?.previousTasks;

      if (!previousTasks) return;

      queryClient.setQueryData<Task[]>(QUERY_KEY, previousTasks);
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error);
    },
  });
};
