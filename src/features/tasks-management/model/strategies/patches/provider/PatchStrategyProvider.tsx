import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { usePatchUITasks } from "@/features/tasks-management/model/strategies/patches/ui-tasks/usePatchUITasks";
import { useAddTaskMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useAddTaskMutation";
import {
  TasksStrategyContext,
  TasksStrategyContextValue,
} from "@/features/tasks-management/model/providers/TasksStrategyContext";
import { useInitPatchStrategy } from "@/features/tasks-management/model/strategies/patches/lifecycle/useInitPatchStrategy";
import { useUpdateTaskMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useUpdateTaskMutation";
import { useDeleteTaskMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useDeleteTaskMutation";
import { useToggleTaskMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useToggleTaskMutation";
import { useDeleteCompletedTasksMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useDeleteCompletedTasksMutation";
import { useMarkAllTasksCompletedMutation } from "@/features/tasks-management/model/strategies/patches/mutations/useMarkAllTasksCompletedMutation";

export const PatchStrategyProvider = ({ children }: PropsWithChildren) => {
  const uiTasks = usePatchUITasks();

  useInitPatchStrategy(uiTasks);

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
