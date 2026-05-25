import type { UITask } from "@/entities/task";
import type {
  AddTaskMutation,
  DeleteTaskMutation,
  ToggleTaskMutation,
  UpdateTaskInfoMutation,
  DeleteCompletedTasksMutation,
  MarkAllTasksCompletedMutation,
} from "../types";

import { createContext } from "react";

export type TasksStrategyContextValue = {
  uiTasks: UITask[];

  addTaskMutation: AddTaskMutation;
  deleteTaskMutation: DeleteTaskMutation;
  toggleTaskMutation: ToggleTaskMutation;
  updateTaskInfoMutation: UpdateTaskInfoMutation;
  deleteCompletedTasksMutation: DeleteCompletedTasksMutation;
  markAllTasksCompletedMutation: MarkAllTasksCompletedMutation;
};

export const TasksStrategyContext =
  createContext<TasksStrategyContextValue | null>(null);
