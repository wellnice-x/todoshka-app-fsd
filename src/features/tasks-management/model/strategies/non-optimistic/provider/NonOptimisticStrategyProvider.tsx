import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useUITasks } from "@/features/tasks-management/model/strategies/non-optimistic/ui-tasks/useUITasks";
import { useAddTaskMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useAddTaskMutation";
import {
  TasksStrategyContext,
  TasksStrategyContextValue,
} from "@/features/tasks-management/model/providers/TasksStrategyContext";
import { useInitStrategy } from "@/features/tasks-management/model/strategies/non-optimistic/lifecycle/useInitStrategy";
import { useDeleteTaskMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useDeleteTaskMutation";
import { useToggleTaskMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useToggleTaskMutation";
import { useUpdateTaskInfoMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useUpdateTaskInfoMutation";
import { useDeleteCompletedTasksMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useDeleteCompletedTasksMutation";
import { useMarkAllTasksCompletedMutation } from "@/features/tasks-management/model/strategies/non-optimistic/mutations/useMarkAllTasksCompletedMutation";

export const NonOptimisticStrategyProvider = ({
  children,
}: PropsWithChildren) => {
  const uiTasks = useUITasks();

  useInitStrategy(uiTasks);

  const addTaskMutation = useAddTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const toggleTaskMutation = useToggleTaskMutation();
  const updateTaskInfoMutation = useUpdateTaskInfoMutation();
  const deleteCompletedTasksMutation = useDeleteCompletedTasksMutation();
  const markAllTasksCompletedMutation = useMarkAllTasksCompletedMutation();

  const value: TasksStrategyContextValue = useMemo(
    () => ({
      uiTasks,
      addTaskMutation,
      deleteTaskMutation,
      toggleTaskMutation,
      updateTaskInfoMutation,
      deleteCompletedTasksMutation,
      markAllTasksCompletedMutation,
    }),
    [
      uiTasks,
      addTaskMutation,
      deleteTaskMutation,
      toggleTaskMutation,
      updateTaskInfoMutation,
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
