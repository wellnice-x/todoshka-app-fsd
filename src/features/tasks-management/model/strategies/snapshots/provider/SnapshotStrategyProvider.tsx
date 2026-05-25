import type { PropsWithChildren } from "react";

import {
  TasksStrategyContext,
  TasksStrategyContextValue,
} from "@/features/tasks-management/model/providers/TasksStrategyContext";
import { useUITasks } from "../ui-tasks/useUITasks";
import { useInitStrategy } from "../lifecycle/useInitStrategy";
import { useAddTaskMutation } from "../mutations/useAddTaskMutation";
import { useDeleteTaskMutation } from "../mutations/useDeleteTaskMutation";
import { useToggleTaskMutation } from "../mutations/useToggleTaskMutation";
import { useUpdateTaskInfoMutation } from "../mutations/useUpdateTaskInfoMutation";
import { useDeleteCompletedTasksMutation } from "../mutations/useDeleteCompletedTasksMutation";
import { useMarkAllTasksCompletedMutation } from "../mutations/useMarkAllTasksCompletedMutation";
import { useMemo } from "react";

export const SnapshotStrategyProvider = ({ children }: PropsWithChildren) => {
  const uiTasks = useUITasks();

  useInitStrategy(uiTasks);

  const addTaskMutation = useAddTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const toggleTaskMutation = useToggleTaskMutation();
  const updateTaskInfoMutation = useUpdateTaskInfoMutation();
  const markAllTasksCompletedMutation = useMarkAllTasksCompletedMutation();
  const deleteCompletedTasksMutation = useDeleteCompletedTasksMutation();

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
