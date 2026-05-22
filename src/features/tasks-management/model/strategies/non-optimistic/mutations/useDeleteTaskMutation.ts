import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useTasksNonOptimisticRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/runtime/useTasksNonOptimisticRuntime";

export const useDeleteTaskMutation = () => {
  const { queryClient, optimisticMode, syncWithOptionalToast } =
    useTasksNonOptimisticRuntime();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "delete"],

    mutationFn: ({ taskId }: { taskId: string }) => {
      throwIfOffline();

      return tasksUseCases.deleteTask(taskId);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData(["tasks", optimisticMode], (old: Task[] = []) =>
        old.filter((task) => task.id !== vars.taskId),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });
};
