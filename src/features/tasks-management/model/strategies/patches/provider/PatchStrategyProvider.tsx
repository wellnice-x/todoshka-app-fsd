import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { useUITasks } from "@/features/tasks-management/model/strategies/patches/ui-tasks/useUITasks";
import { useAddTaskMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useAddTaskMutation";
import {
  TasksStrategyContext,
  TasksStrategyContextValue,
} from "@/features/tasks-management/model/providers/TasksStrategyContext";
import { useInitStrategy } from "@/features/tasks-management/model/strategies/patches/lifecycle/useInitStrategy";
import { useDeleteTaskMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useDeleteTaskMutation";
import { useToggleTaskMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useToggleTaskMutation";
import { useUpdateTaskInfoMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useUpdateTaskInfoMutation";
import { useDeleteCompletedTasksMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useDeleteCompletedTasksMutation";
import { useMarkAllTasksCompletedMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useMarkAllTasksCompletedMutation";

export const PatchStrategyProvider = ({ children }: PropsWithChildren) => {
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
