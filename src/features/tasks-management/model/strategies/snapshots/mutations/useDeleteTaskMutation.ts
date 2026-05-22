import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { isNetworkError } from "@/shared/lib/error-utils";
import { useTasksSnapshotsRuntime } from "@/features/tasks-management/model/strategies/snapshots/runtime/useTasksSnapshotsRuntime";

export const useDeleteTaskMutation = () => {
  const {
    queryClient,
    optimisticMode,
    isServerAccessBlocked,
    syncWithOptionalToast,
  } = useTasksSnapshotsRuntime();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "delete"],

    mutationFn: async ({ taskId }: { taskId: string }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.deleteTask(taskId);
    },

    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

      const deletingTask = queryClient
        .getQueryData<Task[]>(["tasks", optimisticMode])
        ?.find((task) => task.id === taskId);

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.filter((task) => task.id !== taskId),
      );

      return { deletingTask };
    },

    onError: (error, _vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      const deletedTask = context?.deletingTask;

      if (!deletedTask) return;

      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        (old = []) => {
          if (old.some((task) => task.id === deletedTask.id)) {
            return old;
          }

          const nextTasks = [...old];

          const insertIndex = nextTasks.findIndex(
            (task) => task.orderIndex > deletedTask.orderIndex,
          );

          if (insertIndex === -1) {
            nextTasks.push(deletedTask);
          } else {
            nextTasks.splice(insertIndex, 0, deletedTask);
          }

          return nextTasks;
        },
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error);
    },
  });
};
