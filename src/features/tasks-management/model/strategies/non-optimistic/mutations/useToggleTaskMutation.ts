import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useTasksNonOptimisticRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/runtime/useTasksNonOptimisticRuntime";

export const useToggleTaskMutation = () => {
  const { queryClient, optimisticMode, syncWithOptionalToast } =
    useTasksNonOptimisticRuntime();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "toggle"],

    mutationFn: ({
      taskId,
      newIsDone,
    }: {
      taskId: string;
      newIsDone: boolean;
    }) => {
      throwIfOffline();

      return tasksUseCases.toggleTask(taskId, newIsDone);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) =>
          task.id === vars.taskId ? { ...task, isDone: vars.newIsDone } : task,
        ),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });
};
