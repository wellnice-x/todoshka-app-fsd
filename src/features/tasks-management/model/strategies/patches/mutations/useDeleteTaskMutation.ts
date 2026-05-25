import { QUERY_KEY, createMutationKey } from "../queryKeys";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/patches/runtime/useStrategyRuntime";
import { createPatchManager } from "@/features/tasks-management/model/strategies/patches/runtime/createPatchManager";
import { tasksUseCases } from "@/entities/task";
import { isNetworkError } from "@/shared/lib/error-utils";
import { throwIfOffline } from "@/shared/lib/network";
import { useMutation } from "@tanstack/react-query";

export const useDeleteTaskMutation = () => {
  const {
    queryClient,
    isServerAccessBlocked,
    resolveEntityId,
    syncWithOptionalToast,
    handleSync,
  } = useStrategyRuntime();

  const { addPatch, removePatch, commitPatch } = createPatchManager(
    queryClient,
    QUERY_KEY,
  );

  return useMutation({
    mutationKey: createMutationKey("delete"),

    mutationFn: async ({ taskId }: { taskId: string }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.deleteTask(taskId);
    },

    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const patch = addPatch(
        (tasks) => tasks.filter((task) => task.id !== taskId),
        "delete",
        resolveEntityId(taskId),
      );

      return { patch };
    },

    onError: (error, _vars, context) => {
      if (!context) return;

      if (isNetworkError(error)) {
        return;
      }

      removePatch(context.patch.id);
    },

    onSuccess: (_data, _vars, context) => {
      if (!context || isServerAccessBlocked) return;

      commitPatch(context.patch);
      removePatch(context.patch.id);
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      handleSync(syncWithOptionalToast(error));
    },
  });
};
