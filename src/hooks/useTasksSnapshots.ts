import type { Task } from "@/entities/task/model/types/task";
import type { OptimisticMode } from "@/features/change-optimistic-mode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQuerySyncWithOptionalToast } from "./useQuerySyncWithOptionalToast";
import { isBulkDeleteNetworkError } from "@/shared/lib/errors/errorUtils";
import { handlePromiseWithToast } from "@/shared/lib/toast/handlePromiseWithToast";
import { useQuerySyncScheduler } from "./useQuerySyncScheduler";
import { useAppRuntimeStore } from "@/stores/appRuntimeStore";
import { useConnectionStore } from "@/stores/connectionStore";
import { useEffect, useRef } from "react";
import { isBulkDeleteError } from "@/shared/lib/errors/guards";
import { isNetworkError } from "@/shared/lib/errors/errorUtils";
import { throwIfOffline } from "@/shared/lib/errors/network/throwIfOffline";
import { useUIKeyStore } from "@/stores/uiKeyStore";
import { tasksUseCases } from "@/entities/task";
import useServerAccessState from "./useServerAccessState";
import useTasksWithUIKeys from "./useTasksWithUIKeys";
import fallbackTasks from "@/entities/task/mocks/fallbackTasks";

const useTasksSnapshots = (optimisticMode: OptimisticMode) => {
  const queryClient = useQueryClient();

  const { isServerAccessBlocked, isServerAccessUncertain } =
    useServerAccessState();

  const { setUIKey, transferUIKey, cleanupUIKeys } = useUIKeyStore.getState();

  const hasConnectionJustRecovered = useConnectionStore(
    (state) => state.hasConnectionJustRecovered,
  );

  const wasServerBlockedRef = useRef(false);
  const shouldSyncAfterUnblockRef = useRef(false);

  const removeOptimisticTasks = () => {
    queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
      old.filter((task) => !task.id.startsWith("optimistic-")),
    );
  };

  const handleSync = async (syncPromise: Promise<void> | undefined) => {
    if (!syncPromise) return;

    try {
      await syncPromise;
    } catch {
      removeOptimisticTasks();
    }
  };

  const { scheduleQuerySync } = useQuerySyncScheduler([
    "tasks",
    optimisticMode,
  ]);

  const syncWithOptionalToast =
    useQuerySyncWithOptionalToast(scheduleQuerySync);

  const { data, error, isLoading, isFetching, isRefetching } = useQuery({
    queryKey: ["tasks", optimisticMode],
    queryFn: tasksUseCases.getAll,
    enabled: optimisticMode === "snapshots" && !isServerAccessBlocked,
  });

  const tasks = useTasksWithUIKeys(data);

  const addTaskMutation = useMutation({
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

      const previousTasks =
        queryClient.getQueryData<Task[]>(["tasks", optimisticMode]) ?? [];

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

      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        (old = []) => [...old, tempTask],
      );

      return { tempId };
    },

    onError: (error, _vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      if (!context) return;

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.filter((task) => task.id !== context.tempId),
      );
    },

    onSuccess: (serverTask, _vars, context) => {
      if (!context) return;

      if (!serverTask) return;

      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        (old = []) => {
          if (!old.some((task) => task.id === context.tempId)) {
            return old;
          }

          transferUIKey(context.tempId, serverTask.id);

          return old.map((task) =>
            task.id === context.tempId ? serverTask : task,
          );
        },
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      handleSync(syncWithOptionalToast(error));
    },
  });

  const updateTaskInfoMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "update"],

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
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

      const previousTask = queryClient
        .getQueryData<Task[]>(["tasks", optimisticMode])
        ?.find((task) => task.id === taskId);

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) =>
          task.id === taskId ? { ...task, title, description } : task,
        ),
      );

      return { previousTask };
    },

    onError: (error, vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      const previousTask = context?.previousTask;
      if (!previousTask) return;

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) => (task.id === vars.taskId ? previousTask : task)),
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error, 0);
    },
  });

  const toggleTaskMutation = useMutation({
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

      const previousTask = queryClient
        .getQueryData<Task[]>(["tasks", optimisticMode])
        ?.find((t) => t.id === taskId);

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) => {
          if (task.id === taskId) {
            return { ...task, isDone: newIsDone };
          }
          return task;
        }),
      );

      return { previousTask };
    },

    onError: (error, vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      const previousTask = context?.previousTask;
      if (!previousTask) return;

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) => (task.id === vars.taskId ? previousTask : task)),
      );
    },

    onSuccess: (serverTask) => {
      if (isServerAccessBlocked || !serverTask) return;

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) => (task.id === serverTask.id ? serverTask : task)),
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "delete"],

    mutationFn: async ({ taskId }: { taskId: string }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.deleteTask(taskId);
    },

    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

      const deletingTask = queryClient
        .getQueryData<Task[]>(["tasks", optimisticMode])
        ?.find((task) => task.id === taskId);

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.filter((task) => task.id !== taskId),
      );

      return { deletingTask };
    },

    onError: (error, _vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      const deletedTask = context?.deletingTask;

      if (!deletedTask) return;

      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        (old = []) => {
          if (old.some((task) => task.id === deletedTask.id)) {
            return old;
          }

          const nextTasks = [...old];

          const insertIndex = nextTasks.findIndex(
            (task) => task.orderIndex > deletedTask.orderIndex,
          );

          if (insertIndex === -1) {
            nextTasks.push(deletedTask);
          } else {
            nextTasks.splice(insertIndex, 0, deletedTask);
          }

          return nextTasks;
        },
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error);
    },
  });

  const deleteCompletedTasksMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "bulkDelete"],

    mutationFn: async ({ taskIds }: { taskIds: string[] }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.deleteSome(taskIds);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

      const previousTasks =
        queryClient.getQueryData<Task[]>(["tasks", optimisticMode]) ?? [];

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
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
        queryClient.setQueryData<Task[]>(
          ["tasks", optimisticMode],
          previousTasks,
        );
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

      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        (old = []) => {
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
        },
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error, 0, true);
    },
  });

  const markAllCompletedMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "markAllCompleted"],

    mutationFn: async () => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.markAllCompleted();
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

      const previousTasks = queryClient.getQueryData<Task[]>([
        "tasks",
        optimisticMode,
      ]);

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) => ({ ...task, isDone: true })),
      );

      return { previousTasks };
    },

    onError: (error, _vars, context) => {
      if (isNetworkError(error)) {
        return;
      }

      const previousTasks = context?.previousTasks;

      if (!previousTasks) return;

      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        previousTasks,
      );
    },

    onSettled: (_data, error) => {
      if (isServerAccessBlocked) return;

      syncWithOptionalToast(error);
    },
  });

  useEffect(() => {
    if (optimisticMode !== "snapshots" || isServerAccessUncertain) return;

    const { isNoInternetConnection } = useAppRuntimeStore.getState();

    const wasBlocked = wasServerBlockedRef.current;
    const isNowBlocked = isServerAccessBlocked;
    const hasServerUnblocked = wasBlocked === true && isNowBlocked === false;

    const existing = queryClient.getQueryData(["tasks", optimisticMode]);

    if (!existing && isServerAccessBlocked && !isLoading) {
      queryClient.setQueryData(["tasks", optimisticMode], fallbackTasks());
    }

    if (hasServerUnblocked) {
      shouldSyncAfterUnblockRef.current = true;
    }

    if (
      shouldSyncAfterUnblockRef.current &&
      (hasConnectionJustRecovered || !isNoInternetConnection)
    ) {
      shouldSyncAfterUnblockRef.current = false;

      const removeOfflineAndFallbackTasks = (tasks: Task[]) =>
        tasks.filter(
          (task) =>
            !task.id.startsWith("offline-") && !task.id.startsWith("fallback-"),
        );

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        removeOfflineAndFallbackTasks(old),
      );

      handlePromiseWithToast(
        scheduleQuerySync(0, true, true),
        { success: "Synced. Interface is up to date" },
        2500,
        "✅",
      );
    } else if (hasConnectionJustRecovered) {
      scheduleQuerySync(0);
    }

    wasServerBlockedRef.current = isNowBlocked;
  }, [
    hasConnectionJustRecovered,
    isServerAccessUncertain,
    isServerAccessBlocked,
    scheduleQuerySync,
    optimisticMode,
    queryClient,
    isLoading,
  ]);

  useEffect(() => {
    if (optimisticMode !== "snapshots") return;

    scheduleQuerySync(0);
  }, [scheduleQuerySync, optimisticMode]);

  useEffect(() => {
    if (optimisticMode !== "snapshots") return;

    cleanupUIKeys(tasks.map((task) => task.id));
  }, [tasks, optimisticMode, cleanupUIKeys]);

  return {
    tasks,
    error,
    addTaskMutation,
    deleteTaskMutation,
    toggleTaskMutation,
    updateTaskInfoMutation,
    markAllCompletedMutation,
    deleteCompletedTasksMutation,
    tasksIsInitLoading: isLoading,
    tasksIsRefetching: isRefetching,
    tasksIsFetching: isFetching,
  };
};

export default useTasksSnapshots;
