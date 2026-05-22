import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useAddTaskMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useAddTaskMutation";
import {
  TasksStrategyContext,
  TasksStrategyContextValue,
} from "@/features/tasks-management/model/providers/TasksStrategyContext";
import { useUpdateTaskMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useUpdateTaskMutation";
import { useDeleteTaskMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useDeleteTaskMutation";
import { useToggleTaskMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useToggleTaskMutation";
import { useNonOptimisticUITasks } from "@/features/tasks-management/model/strategies/non-optimistic/ui-tasks/useNonOptimisticUITasks";
import { useInitNonOptimisticStrategy } from "@/features/tasks-management/model/strategies/non-optimistic/lifecycle/useInitNonOptimisticStrategy";
import { useDeleteCompletedTasksMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useDeleteCompletedTasksMutation";
import { useMarkAllTasksCompletedMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useMarkAllTasksCompletedMutation";

export const NonOptimisticStrategyProvider = ({
  children,
}: PropsWithChildren) => {
  const uiTasks = useNonOptimisticUITasks();

  useInitNonOptimisticStrategy(uiTasks);

  const addTaskMutation = useAddTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const toggleTaskMutation = useToggleTaskMutation();
  const deleteCompletedTasksMutation = useDeleteCompletedTasksMutation();
  const markAllTasksCompletedMutation = useMarkAllTasksCompletedMutation();

  const value: TasksStrategyContextValue = useMemo(
    () => ({
      uiTasks,
      addTaskMutation,
      updateTaskMutation,
      deleteTaskMutation,
      toggleTaskMutation,
      deleteCompletedTasksMutation,
      markAllTasksCompletedMutation,
    }),
    [
      uiTasks,
      addTaskMutation,
      updateTaskMutation,
      deleteTaskMutation,
      toggleTaskMutation,
      deleteCompletedTasksMutation,
      markAllTasksCompletedMutation,
    ],
  );

  return (
    <TasksStrategyContext.Provider value={value}>
      {children}
    </TasksStrategyContext.Provider>
  );
};
