import type { Task } from "@/entities/task";

import { useStrategyRuntime } from "../runtime/useStrategyRuntime";
import { QUERY_KEY, createMutationKey } from "../queryKeys";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useMutation } from "@tanstack/react-query";

export const useUpdateTaskInfoMutation = () => {
  const { queryClient, syncWithOptionalToast } = useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("update"),

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
      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
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
