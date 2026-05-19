import type { Task } from "@/entities/task";
import type { OptimisticMode } from "@/features/change-optimistic-mode";
import { isBulkDeleteNetworkError, isNetworkError } from "@/shared/lib/errors/errorUtils";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQuerySyncWithOptionalToast } from "./useQuerySyncWithOptionalToast";
import { handlePromiseWithToast } from "@/shared/lib/toast/handlePromiseWithToast";
import { useQuerySyncScheduler } from "@/shared/lib/react-query/useQuerySyncScheduler";
import { useServerAccessState } from "@/app/model";
import { useConnectionStore } from "@/shared/api/network/model/connectionStore";
import { isBulkDeleteError } from "@/shared/lib/errors/guards";
import { useRuntimeStore } from "@/app/model";
import { throwIfOffline } from "@/shared/lib/errors/network/throwIfOffline";
import { tasksUseCases } from "@/entities/task";
import { useUIKeyStore } from "@/entities/task";
import { fallbackTasks } from "@/entities/task";
import useTasksWithUIKeys from "./useTasksWithUIKeys";

type PatchOperation = "create" | "update" | "delete";

type Patch = {
  id: string;
  apply: (tasks: Task[]) => Task[];
  operation: PatchOperation;
  entityId?: string;
};

const useTasksPatches = (optimisticMode: OptimisticMode) => {
  const queryClient = useQueryClient();

  const { isServerAccessBlocked, isServerAccessUncertain } = useServerAccessState();

  const { setUIKey, transferUIKey, cleanupUIKeys } = useUIKeyStore.getState();

  const hasConnectionJustRecovered = useConnectionStore(
    (state) => state.hasConnectionJustRecovered,
  );

  const wasServerBlockedRef = useRef(false);
  const shouldSyncAfterUnblockRef = useRef(false);

  const { scheduleQuerySync } = useQuerySyncScheduler([
    "tasks",
    optimisticMode,
  ]);

  const syncWithOptionalToast =
    useQuerySyncWithOptionalToast(scheduleQuerySync);

  const getUpdatedAt = useCallback(() => {
    return queryClient.getQueryState(["tasks", optimisticMode])?.dataUpdatedAt;
  }, [queryClient, optimisticMode]);

  const resolveEntityId = (id: string) =>
    isServerAccessBlocked ? undefined : id;

  const addPatch = (
    apply: Patch["apply"],
    operation: PatchOperation,
    entityId?: string,
  ) => {
    const id = crypto.randomUUID();

    const patch: Patch = {
      id,
      apply,
      operation,
      entityId,
    };

    queryClient.setQueryData<Patch[]>(["tasksPatches"], (old = []) => {
      const filteredOld = entityId
        ? old.filter((patch) => patch.entityId !== entityId)
        : old;

      return [...filteredOld, patch];
    });
    return patch;
  };

  const removePatch = (patchId: string) => {
    queryClient.setQueryData<Patch[]>(["tasksPatches"], (old = []) =>
      old.filter((patch) => patch.id !== patchId),
    );
  };

  const commitPatch = (patch: Patch) => {
    queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
      patch.apply(old),
    );
  };

  const applyPatches = (tasks: Task[], patches: Patch[]) => {
    return patches.reduce((acc, patch) => patch.apply(acc), tasks);
  };

  const handleSync = useCallback(
    async (syncPromise: Promise<void> | undefined) => {
      if (!syncPromise) return;

      try {
        const dataUpdatedBefore = getUpdatedAt();

        await syncPromise;

        const dataUpdatedAfter = getUpdatedAt();

        if (
          dataUpdatedAfter &&
          dataUpdatedBefore &&
          dataUpdatedAfter !== dataUpdatedBefore
        ) {
          queryClient.setQueryData<Patch[]>(["tasksPatches"], []);
        }
      } catch {
        queryClient.setQueryData<Patch[]>(["tasksPatches"], (old = []) =>
          old.filter((patch) => patch.operation !== "create"),
        );
      }
    },
    [queryClient, getUpdatedAt],
  );

  const { data, error, isLoading, isFetching, isRefetching } = useQuery({
    queryKey: ["tasks", optimisticMode],
    queryFn: tasksUseCases.getAll,
    enabled: optimisticMode === "patches" && !isServerAccessBlocked,
  });

  const { data: patches = [] } = useQuery({
    queryKey: ["tasksPatches"],
    queryFn: () => [],
    enabled: false,
    initialData: [],
  });

  const mergedTasks = useMemo(() => {
    const serverTasks = data ?? [];

    return patches.length ? applyPatches(serverTasks, patches) : serverTasks;
  }, [data, patches]);

  const tasks = useTasksWithUIKeys(mergedTasks);

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

  const deleteTaskMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "delete"],

    mutationFn: async ({ taskId }: { taskId: string }) => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.deleteTask(taskId);
    },

    onMutate: async ({ taskId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

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

  const deleteCompletedTasksMutation = useMutation({
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

  const markAllCompletedMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "markAllCompleted"],

    mutationFn: async () => {
      if (isServerAccessBlocked) return;
      throwIfOffline();

      return tasksUseCases.markAllCompleted();
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["tasks", optimisticMode] });

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

  useEffect(() => {
    if (optimisticMode !== "patches" || isServerAccessUncertain) return;

    const { isNoInternetConnection } = useRuntimeStore.getState();

    const wasBlocked = wasServerBlockedRef.current;
    const isNowBlocked = isServerAccessBlocked;
    const hasServerUnblocked = wasBlocked === true && isNowBlocked === false;

    const existing = queryClient.getQueryData(["tasks", optimisticMode]);

    if (!existing && isServerAccessBlocked && !isLoading) {
      queryClient.setQueryData(["tasks", optimisticMode], fallbackTasks());
    }

    if (hasServerUnblocked) {
      shouldSyncAfterUnblockRef.current = true;

      const removeOfflineAndFallbackTasks = (tasks: Task[]) =>
        tasks.filter(
          (task) =>
            !task.id.startsWith("offline-") && !task.id.startsWith("fallback-"),
        );

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        removeOfflineAndFallbackTasks(old),
      );

      queryClient.setQueryData<Patch[]>(["tasksPatches"], []);
    }

    if (
      shouldSyncAfterUnblockRef.current &&
      (hasConnectionJustRecovered || !isNoInternetConnection)
    ) {
      shouldSyncAfterUnblockRef.current = false;

      handlePromiseWithToast(
        scheduleQuerySync(0, true, true),
        { success: "Synced. Interface is up to date" },
        2500,
        "✅",
      );
    } else if (hasConnectionJustRecovered) {
      handleSync(scheduleQuerySync(0, false, true));
    }

    wasServerBlockedRef.current = isNowBlocked;
  }, [
    hasConnectionJustRecovered,
    isServerAccessUncertain,
    isServerAccessBlocked,
    optimisticMode,
    queryClient,
    isLoading,
    scheduleQuerySync,
    handleSync,
  ]);

  useEffect(() => {
    if (optimisticMode !== "patches") return;

    scheduleQuerySync(0);
  }, [optimisticMode, scheduleQuerySync, queryClient]);

  useEffect(() => {
    if (optimisticMode !== "patches") return;

    cleanupUIKeys(tasks.map((task) => task.id));
  }, [tasks, cleanupUIKeys, optimisticMode]);

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

export default useTasksPatches;
