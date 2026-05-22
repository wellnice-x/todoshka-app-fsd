import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { isNetworkError } from "@/shared/lib/error-utils";
import { throwIfOffline } from "@/shared/lib/network";
import { tasksUseCases, useUIKeyStore } from "@/entities/task";
import { useTasksPatchRuntime } from "../runtime/useTasksPatchRuntime";
import { createPatchManager } from "../lib/createPatchManager";
import { usePatchedTasksView } from "../query-view/usePatchedTasksView";

export const useAddTaskMutation = () => {
  const {
    queryClient,
    optimisticMode,
    isServerAccessBlocked,
    resolveEntityId,
    syncWithOptionalToast,
    handleSync,
  } = useTasksPatchRuntime();

  const { setUIKey, transferUIKey } = useUIKeyStore.getState();

  const { addPatch, removePatch } = createPatchManager(
    queryClient,
    optimisticMode,
  );

  const tasks = usePatchedTasksView();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "add"],

    mutationFn: async ({ title }: { title: string }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.addTask({
        title,
        description: "",
        isDone: false,
      });
    },

    onMutate: async ({ title }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

      const tempId: string = isServerAccessBlocked
        ? `offline-${crypto.randomUUID()}`
        : `optimistic-${crypto.randomUUID()}`;

      const maxOrder =
        tasks.length > 0
          ? Math.max(...tasks.map((task) => task.orderIndex ?? 0))
          : 0;

      setUIKey(tempId, tempId);

      const tempTask: Task = {
        id: tempId,
        title,
        description: "",
        isDone: false,
        orderIndex: maxOrder + 1,
        createdAt: new Date(),
      };

      const patch = addPatch(
        (tasks) => [...tasks, tempTask],
        "create",
        resolveEntityId(tempId),
      );

      return { patch, tempId, tempTask, optimisticSince: tempTask.createdAt };
    },

    onError: (error, _vars, context) => {
      if (!context) return;

      if (isNetworkError(error)) {
        return;
      }

      removePatch(context.patch.id);
    },

    onSuccess: (serverTask, _vars, context) => {
      if (!context || !serverTask) return;

      removePatch(context.patch.id);

      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        (old = []) => {
          if (old.some((task) => task.id === serverTask.id)) return old;

          transferUIKey(context.tempId, serverTask.id);

          return [...old, serverTask].sort(
            (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
          );
        },
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      handleSync(syncWithOptionalToast(error));
    },
  });
};
