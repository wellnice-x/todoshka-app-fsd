import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { isNetworkError } from "@/shared/lib/error-utils";
import { throwIfOffline } from "@/shared/lib/network";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/snapshots/runtime/useStrategyRuntime";
import { tasksUseCases, useUIKeyStore } from "@/entities/task";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/snapshots/config";

export const useAddTaskMutation = () => {
  const {
    queryClient,
    isServerAccessBlocked,
    syncWithOptionalToast,
    handleSync,
  } = useStrategyRuntime();

  const { setUIKey, transferUIKey } = useUIKeyStore.getState();

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

      const previousTasks = queryClient.getQueryData<Task[]>(QUERY_KEY) ?? [];

      const tempId: string = isServerAccessBlocked
        ? `offline-${crypto.randomUUID()}`
        : `optimistic-${crypto.randomUUID()}`;

      const maxOrder =
        previousTasks.length > 0
          ? Math.max(...previousTasks.map((task) => task.orderIndex ?? 0))
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

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) => [
        ...old,
        tempTask,
      ]);

      return { tempId };
    },

    onError: (error, _vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      if (!context) return;

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.filter((task) => task.id !== context.tempId),
      );
    },

    onSuccess: (serverTask, _vars, context) => {
      if (!context) return;

      if (!serverTask) return;

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) => {
        if (!old.some((task) => task.id === context.tempId)) {
          return old;
        }

        transferUIKey(context.tempId, serverTask.id);

        return old.map((task) =>
          task.id === context.tempId ? serverTask : task,
        );
      });
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      handleSync(syncWithOptionalToast(error));
    },
  });
};
