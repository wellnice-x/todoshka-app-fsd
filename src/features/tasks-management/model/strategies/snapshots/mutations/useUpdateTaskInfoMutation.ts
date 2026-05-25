import type { Task } from "@/entities/task";

import { QUERY_KEY, createMutationKey } from "../queryKeys";
import { useStrategyRuntime } from "../runtime/useStrategyRuntime";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { isNetworkError } from "@/shared/lib/error-utils";
import { useMutation } from "@tanstack/react-query";

export const useUpdateTaskInfoMutation = () => {
  const { queryClient, isServerAccessBlocked, syncWithOptionalToast } =
    useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("update"),

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
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousTask = queryClient
        .getQueryData<Task[]>(QUERY_KEY)
        ?.find((task) => task.id === taskId);

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
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

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.map((task) => (task.id === vars.taskId ? previousTask : task)),
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error, 0);
    },
  });
};
