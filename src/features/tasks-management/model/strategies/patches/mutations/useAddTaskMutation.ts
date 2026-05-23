import type { Task } from "@/entities/task";
import { tasksUseCases, useUIKeyStore } from "@/entities/task";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/patches/runtime/useStrategyRuntime";
import { createPatchManager } from "@/features/tasks-management/model/strategies/patches/lib/createPatchManager";
import { isNetworkError } from "@/shared/lib/error-utils";
import { throwIfOffline } from "@/shared/lib/network";
import { useMutation } from "@tanstack/react-query";
import { useUITasks } from "@/features/tasks-management/model/strategies/patches/ui-tasks/useUITasks";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/patches/config";

export const useAddTaskMutation = () => {
  const {
    queryClient,
    isServerAccessBlocked,
    resolveEntityId,
    syncWithOptionalToast,
    handleSync,
  } = useStrategyRuntime();

  const { setUIKey, transferUIKey } = useUIKeyStore.getState();

  const { addPatch, removePatch } = createPatchManager(queryClient, QUERY_KEY);

  const uiTasks = useUITasks();

  return useMutation({
    mutationKey: createMutationKey("add"),

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
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const tempId: string = isServerAccessBlocked
        ? `offline-${crypto.randomUUID()}`
        : `optimistic-${crypto.randomUUID()}`;

      const maxOrder =
        uiTasks.length > 0
          ? Math.max(...uiTasks.map((task) => task.orderIndex ?? 0))
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

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) => {
        if (old.some((task) => task.id === serverTask.id)) return old;

        transferUIKey(context.tempId, serverTask.id);

        return [...old, serverTask].sort(
          (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0),
        );
      });
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      handleSync(syncWithOptionalToast(error));
    },
  });
};
