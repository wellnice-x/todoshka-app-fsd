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

export const useToggleTaskMutation = () => {
  const { queryClient, isServerAccessBlocked, syncWithOptionalToast } =
    useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("toggle"),

    mutationFn: async ({
      taskId,
      newIsDone,
    }: {
      taskId: string;
      newIsDone: boolean;
    }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.toggleTask(taskId, newIsDone);
    },

    onMutate: async ({ taskId, newIsDone }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousTask = queryClient
        .getQueryData<Task[]>(QUERY_KEY)
        ?.find((t) => t.id === taskId);

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.map((task) => {
          if (task.id === taskId) {
            return { ...task, isDone: newIsDone };
          }
          return task;
        }),
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

    onSuccess: (serverTask) => {
      if (isServerAccessBlocked || !serverTask) return;

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.map((task) => (task.id === serverTask.id ? serverTask : task)),
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error);
    },
  });
};
