import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { throwIfOffline } from "@/shared/lib/network";
import { tasksUseCases } from "@/entities/task";
import { useTasksPatchRuntime } from "../runtime/useTasksPatchRuntime";
import { createPatchManager } from "../lib/createPatchManager";
import { isBulkDeleteNetworkError } from "@/shared/lib/error-utils";
import { isBulkDeleteError } from "@/shared/lib/error-utils";

export const useDeleteCompletedTasksMutation = () => {
  const {
    queryClient,
    optimisticMode,
    isServerAccessBlocked,
    syncWithOptionalToast,
    handleSync,
  } = useTasksPatchRuntime();

  const { addPatch, removePatch, commitPatch } = createPatchManager(
    queryClient,
    optimisticMode,
  );

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "bulkDelete"],

    mutationFn: async ({ taskIds }: { taskIds: string[] }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.deleteSome(taskIds);
    },

    onMutate: async ({ taskIds }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

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

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
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
