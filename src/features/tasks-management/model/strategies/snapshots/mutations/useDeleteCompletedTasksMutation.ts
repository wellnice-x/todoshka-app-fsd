import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { isBulkDeleteError } from "@/shared/lib/error-utils";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/snapshots/runtime/useStrategyRuntime";
import { isBulkDeleteNetworkError } from "@/shared/lib/error-utils";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/snapshots/queryKeys";

export const useDeleteCompletedTasksMutation = () => {
  const { queryClient, isServerAccessBlocked, syncWithOptionalToast } =
    useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("bulkDelete"),

    mutationFn: async ({ taskIds }: { taskIds: string[] }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.deleteSome(taskIds);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.filter((task) => !task.isDone),
      );

      return { previousTasks };
    },

    onError: (error, vars, context) => {
      if (isBulkDeleteNetworkError(error)) {
        return;
      }

      const previousTasks = context?.previousTasks;

      if (!previousTasks) return;

      if (!isBulkDeleteError(error)) {
        queryClient.setQueryData<Task[]>(QUERY_KEY, previousTasks);
        return;
      }

      const results = error.results;

      const failedIds = results
        .map((result, index) =>
          result.status === "rejected" ? vars.taskIds[index] : null,
        )
        .filter(Boolean) as string[];

      if (!failedIds.length) return;

      const failedTasks = previousTasks.filter((task) =>
        failedIds.includes(task.id),
      );

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) => {
        const nextTasks = [...old];

        failedTasks.forEach((task) => {
          if (nextTasks.some((t) => t.id === task.id)) return;

          const insertIndex = nextTasks.findIndex(
            (t) => t.orderIndex > task.orderIndex,
          );

          if (insertIndex === -1) {
            nextTasks.push(task);
          } else {
            nextTasks.splice(insertIndex, 0, task);
          }
        });

        return nextTasks;
      });
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error, 0, true);
    },
  });
};
