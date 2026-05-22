import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { isNetworkError } from "@/shared/lib/error-utils";
import { useTasksSnapshotsRuntime } from "../runtime/useTasksSnapshotsRuntime";

export const useMarkAllCompletedMutation = () => {
  const {
    queryClient,
    optimisticMode,
    isServerAccessBlocked,
    syncWithOptionalToast,
  } = useTasksSnapshotsRuntime();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "markAllCompleted"],

    mutationFn: async () => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.markAllCompleted();
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

      const previousTasks = queryClient.getQueryData<Task[]>([
        "tasks",
        optimisticMode,
      ]);

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
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

      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        previousTasks,
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error);
    },
  });
};
