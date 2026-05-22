import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { isNetworkError } from "@/shared/lib/error-utils";
import { useTasksSnapshotsRuntime } from "../runtime/useTasksSnapshotsRuntime";

export const useUpdateTaskMutation = () => {
  const {
    queryClient,
    optimisticMode,
    isServerAccessBlocked,
    syncWithOptionalToast,
  } = useTasksSnapshotsRuntime();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "update"],

    mutationFn: async ({
      taskId,
      title,
      description,
    }: {
      taskId: string;
      title: string;
      description: string;
    }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.updateTaskInfo(taskId, title, description);
    },

    onMutate: async ({ taskId, title, description }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

      const previousTask = queryClient
        .getQueryData<Task[]>(["tasks", optimisticMode])
        ?.find((task) => task.id === taskId);

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) =>
          task.id === taskId ? { ...task, title, description } : task,
        ),
      );

      return { previousTask };
    },

    onError: (error, vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      const previousTask = context?.previousTask;
      if (!previousTask) return;

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) => (task.id === vars.taskId ? previousTask : task)),
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error, 0);
    },
  });
};
