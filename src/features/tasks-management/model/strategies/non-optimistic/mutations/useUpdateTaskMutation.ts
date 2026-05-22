import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useTasksNonOptimisticRuntime } from "../runtime/useTasksNonOptimisticRuntime";

export const useUpdateTaskMutation = () => {
  const { queryClient, optimisticMode, syncWithOptionalToast } =
    useTasksNonOptimisticRuntime();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "update"],

    mutationFn: ({
      taskId,
      title,
      description,
    }: {
      taskId: string;
      title: string;
      description: string;
    }) => {
      throwIfOffline();

      return tasksUseCases.updateTaskInfo(taskId, title, description);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) =>
          task.id === vars.taskId
            ? {
                ...task,
                title: vars.title,
                description: vars.description,
              }
            : task,
        ),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error, 0);
    },
  });
};
