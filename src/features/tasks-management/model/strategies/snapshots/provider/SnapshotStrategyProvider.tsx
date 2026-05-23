import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useUITasks } from "@/features/tasks-management/model/strategies/snapshots/ui-tasks/useUITasks";
import { useAddTaskMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useAddTaskMutation";
import {
  TasksStrategyContext,
  TasksStrategyContextValue,
} from "@/features/tasks-management/model/providers/TasksStrategyContext";
import { useUpdateTaskInfoMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useUpdateTaskInfoMutation";
import { useDeleteTaskMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useDeleteTaskMutation";
import { useToggleTaskMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useToggleTaskMutation";
import { useInitStrategy } from "@/features/tasks-management/model/strategies/snapshots/lifecycle/useInitStrategy";
import { useDeleteCompletedTasksMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useDeleteCompletedTasksMutation";
import { useMarkAllTasksCompletedMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useMarkAllTasksCompletedMutation";

export const SnapshotStrategyProvider = ({ children }: PropsWithChildren) => {
  const uiTasks = useUITasks();

  useInitStrategy(uiTasks);

  const addTaskMutation = useAddTaskMutation();
  const updateTaskInfoMutation = useUpdateTaskInfoMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const toggleTaskMutation = useToggleTaskMutation();
  const markAllTasksCompletedMutation = useMarkAllTasksCompletedMutation();
  const deleteCompletedTasksMutation = useDeleteCompletedTasksMutation();

  const value: TasksStrategyContextValue = useMemo(
    () => ({
      uiTasks,
      addTaskMutation,
      updateTaskInfoMutation,
      deleteTaskMutation,
      toggleTaskMutation,
      deleteCompletedTasksMutation,
      markAllTasksCompletedMutation,
    }),
    [
      uiTasks,
      addTaskMutation,
      updateTaskInfoMutation,
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
