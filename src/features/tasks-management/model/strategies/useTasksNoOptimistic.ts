import type { Task } from "@/entities/task";
import type { OptimisticMode } from "@/shared/types/optimisticMode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQuerySyncWithOptionalToast } from "@/shared/lib/react-query";
import { useQuerySyncScheduler } from "@/shared/lib/react-query";
import { useServerAccessState } from "@/shared/model/access/useServerAccessState";
import { useTasksWithUIKeys } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/errors";
import { useUIKeyStore } from "@/entities/task";
import { tasksUseCases } from "@/entities/task";
import { useEffect } from "react";

const useTasksNoOptimistic = (optimisticMode: OptimisticMode) => {
  const queryClient = useQueryClient();

  const { isServerAccessBlocked } = useServerAccessState();

  const { cleanupUIKeys } = useUIKeyStore.getState();

  const { scheduleQuerySync } = useQuerySyncScheduler([
    "tasks",
    optimisticMode,
  ]);

  const syncWithOptionalToast =
    useQuerySyncWithOptionalToast(scheduleQuerySync);

  const { data, error, isLoading, isFetching, isRefetching } = useQuery({
    queryKey: ["tasks", optimisticMode],
    queryFn: tasksUseCases.getAll,
    enabled: optimisticMode === "none" && !isServerAccessBlocked,
  });

  const tasks = useTasksWithUIKeys(data);

  const addTaskMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "add"],

    mutationFn: ({ title }: { title: string }) => {
      throwIfOffline();

      return tasksUseCases.addTask({
        title,
        description: "",
        isDone: false,
      });
    },

    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        (old = []) => [...old, newTask],
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });

  const updateTaskInfoMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "update"],

    mutationFn: ({
      taskId,
      title,
      description,
    }: {
      taskId: string;
      title: string;
      description: string;
    }) => {
      throwIfOffline();

      return tasksUseCases.updateTaskInfo(taskId, title, description);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) =>
          task.id === vars.taskId
            ? {
                ...task,
                title: vars.title,
                description: vars.description,
              }
            : task,
        ),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error, 0);
    },
  });

  const toggleTaskMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "toggle"],

    mutationFn: ({
      taskId,
      newIsDone,
    }: {
      taskId: string;
      newIsDone: boolean;
    }) => {
      throwIfOffline();

      return tasksUseCases.toggleTask(taskId, newIsDone);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) =>
          task.id === vars.taskId ? { ...task, isDone: vars.newIsDone } : task,
        ),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "delete"],

    mutationFn: ({ taskId }: { taskId: string }) => {
      throwIfOffline();

      return tasksUseCases.deleteTask(taskId);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData(["tasks", optimisticMode], (old: Task[] = []) =>
        old.filter((task) => task.id !== vars.taskId),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });

  const deleteCompletedTasksMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "bulkDelete"],

    mutationFn: ({ taskIds }: { taskIds: string[] }) => {
      throwIfOffline();

      return tasksUseCases.deleteSome(taskIds);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.filter((task) => !vars.taskIds.includes(task.id)),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error, 0, true);
    },
  });

  const markAllCompletedMutation = useMutation({
    mutationKey: ["tasks", optimisticMode, "markAllCompleted"],

    mutationFn: () => {
      throwIfOffline();

      return tasksUseCases.markAllCompleted();
    },

    onSuccess: () => {
      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.map((task) => ({ ...task, isDone: true })),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });

  useEffect(() => {
    if (optimisticMode !== "none") return;

    scheduleQuerySync(0);
  }, [optimisticMode, scheduleQuerySync]);

  useEffect(() => {
    if (optimisticMode !== "none") return;

    cleanupUIKeys(tasks.map((task) => task.id));
  }, [tasks, cleanupUIKeys, optimisticMode]);

  return {
    tasks,
    addTaskMutation,
    updateTaskInfoMutation,
    deleteTaskMutation,
    toggleTaskMutation,
    deleteCompletedTasksMutation,
    markAllCompletedMutation,
    tasksIsInitLoading: isLoading,
    tasksIsRefetching: isRefetching,
    tasksIsFetching: isFetching,
    error,
  };
};

export default useTasksNoOptimistic;
