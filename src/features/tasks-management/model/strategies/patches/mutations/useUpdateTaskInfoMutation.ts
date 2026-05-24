import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { isNetworkError } from "@/shared/lib/error-utils";
import { throwIfOffline } from "@/shared/lib/network";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/patches/runtime/useStrategyRuntime";
import { createPatchManager } from "@/features/tasks-management/model/strategies/patches/runtime/createPatchManager";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/patches/queryKeys";

export const useUpdateTaskInfoMutation = () => {
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

      const patch = addPatch(
        (tasks) =>
          tasks.map((task) =>
            task.id === taskId ? { ...task, title, description } : task,
          ),
        "update",
        resolveEntityId(taskId),
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

      handleSync(syncWithOptionalToast(error, 0));
    },
  });
};
