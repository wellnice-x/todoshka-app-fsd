import type { UITask } from "@/entities/task";
import type {
  AddTaskMutation,
  DeleteTaskMutation,
  ToggleTaskMutation,
  UpdateTaskInfoMutation,
  DeleteCompletedTasksMutation,
  MarkAllTasksCompletedMutation,
} from "@/features/tasks-management/model/types/mutations";
import { createContext } from "react";

export type TasksStrategyContextValue = {
  uiTasks: UITask[];

  addTaskMutation: AddTaskMutation;
  updateTaskInfoMutation: UpdateTaskInfoMutation;
  deleteTaskMutation: DeleteTaskMutation;
  toggleTaskMutation: ToggleTaskMutation;
  deleteCompletedTasksMutation: DeleteCompletedTasksMutation;
  markAllTasksCompletedMutation: MarkAllTasksCompletedMutation;
};

export const TasksStrategyContext =
  createContext<TasksStrategyContextValue | null>(null);
