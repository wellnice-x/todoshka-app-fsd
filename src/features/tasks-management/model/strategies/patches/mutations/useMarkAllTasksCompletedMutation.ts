import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { isNetworkError } from "@/shared/lib/error-utils";
import { throwIfOffline } from "@/shared/lib/network";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/patches/runtime/useStrategyRuntime";
import { createPatchManager } from "@/features/tasks-management/model/strategies/patches/lib/createPatchManager";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/patches/config";

export const useMarkAllTasksCompletedMutation = () => {
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
    mutationKey: createMutationKey("markAllTasksCompleted"),

    mutationFn: async () => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.markAllTasksCompleted();
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const patch = addPatch(
        (tasks) => tasks.map((task) => ({ ...task, isDone: true })),
        "update",
      );

      return { patch };
    },

    onError: (error, _vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      if (!context) return;

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
