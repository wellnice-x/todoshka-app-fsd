import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useSnapshotUITasks } from "@/features/tasks-management/model/strategies/snapshots/ui-tasks/useSnapshotUITasks";
import { useAddTaskMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useAddTaskMutation";
import {
  TasksStrategyContext,
  TasksStrategyContextValue,
} from "@/features/tasks-management/model/providers/TasksStrategyContext";
import { useUpdateTaskMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useUpdateTaskMutation";
import { useDeleteTaskMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useDeleteTaskMutation";
import { useToggleTaskMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useToggleTaskMutation";
import { useInitSnapshotStrategy } from "@/features/tasks-management/model/strategies/snapshots/lifecycle/useInitSnapshotStrategy";
import { useDeleteCompletedTasksMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useDeleteCompletedTasksMutation";
import { useMarkAllTasksCompletedMutation } from "@/features/tasks-management/model/strategies/snapshots/mutations/useMarkAllTasksCompletedMutation";

export const SnapshotStrategyProvider = ({ children }: PropsWithChildren) => {
  const uiTasks = useSnapshotUITasks();

  useInitSnapshotStrategy(uiTasks);

  const addTaskMutation = useAddTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const toggleTaskMutation = useToggleTaskMutation();
  const markAllTasksCompletedMutation = useMarkAllTasksCompletedMutation();
  const deleteCompletedTasksMutation = useDeleteCompletedTasksMutation();

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
