import { useMutation } from "@tanstack/react-query";
import { isNetworkError } from "@/shared/lib/error-utils";
import { throwIfOffline } from "@/shared/lib/network";
import { tasksUseCases } from "@/entities/task";
import { useTasksPatchRuntime } from "@/features/tasks-management/model/strategies/patches/runtime/useTasksPatchRuntime";
import { createPatchManager } from "@/features/tasks-management/model/strategies/patches/lib/createPatchManager";

export const useToggleTaskMutation = () => {
  const {
    queryClient,
    optimisticMode,
    isServerAccessBlocked,
    resolveEntityId,
    syncWithOptionalToast,
    handleSync,
  } = useTasksPatchRuntime();

  const { addPatch, removePatch, commitPatch } = createPatchManager(
    queryClient,
    optimisticMode,
  );

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "toggle"],

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
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

      const patch = addPatch(
        (tasks) =>
          tasks.map((task) =>
            task.id === taskId ? { ...task, isDone: newIsDone } : task,
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

      handleSync(syncWithOptionalToast(error));
    },
  });
};
