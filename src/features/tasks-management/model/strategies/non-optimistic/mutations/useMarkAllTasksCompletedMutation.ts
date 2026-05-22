import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useTasksNonOptimisticRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/runtime/useTasksNonOptimisticRuntime";

export const useMarkAllTasksCompletedMutation = () => {
  const { queryClient, optimisticMode, syncWithOptionalToast } =
    useTasksNonOptimisticRuntime();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "markAllCompleted"],

    mutationFn: () => {
      throwIfOffline();

      return tasksUseCases.markAllCompleted();
    },

    onSuccess: () => {
      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) => ({ ...task, isDone: true })),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });
};
