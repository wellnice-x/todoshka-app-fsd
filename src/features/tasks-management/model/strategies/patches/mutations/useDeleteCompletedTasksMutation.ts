import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { isBulkDeleteError } from "@/shared/lib/error-utils";
import { createPatchManager } from "@/features/tasks-management/model/strategies/patches/runtime/createPatchManager";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/patches/runtime/useStrategyRuntime";
import { isBulkDeleteNetworkError } from "@/shared/lib/error-utils";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/patches/queryKeys";

export const useDeleteCompletedTasksMutation = () => {
  const {
    queryClient,
    isServerAccessBlocked,
    syncWithOptionalToast,
    handleSync,
  } = useStrategyRuntime();

  const { addPatch, removePatch, commitPatch } = createPatchManager(
    queryClient,
    QUERY_KEY,
  );

  return useMutation({
    mutationKey: createMutationKey("bulkDelete"),

    mutationFn: async ({ taskIds }: { taskIds: string[] }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.deleteSome(taskIds);
    },

    onMutate: async ({ taskIds }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const patch = addPatch(
        (tasks) => tasks.filter((task) => !taskIds.includes(task.id)),
        "delete",
      );

      return { patch };
    },

    onError: (error, vars, context) => {
      if (!context) return;

      if (isBulkDeleteNetworkError(error)) {
        return;
      }

      if (!isBulkDeleteError(error)) {
        removePatch(context.patch.id);
        return;
      }

      const results = error.results;

      const failedIds = results
        .map((result, index) =>
          result.status === "rejected" ? vars.taskIds[index] : null,
        )
        .filter(Boolean) as string[];

      if (!failedIds.length) {
        commitPatch(context.patch);
        removePatch(context.patch.id);
        return;
      }

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.filter((task) => {
          const wasDeleted = vars.taskIds.includes(task.id);
          const failed = failedIds.includes(task.id);

          return !wasDeleted || failed;
        }),
      );

      removePatch(context.patch.id);
    },

    onSuccess: (_data, _vars, context) => {
      if (!context || isServerAccessBlocked) return;

      commitPatch(context.patch);
      removePatch(context.patch.id);
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      handleSync(syncWithOptionalToast(error, 0, true));
    },
  });
};
