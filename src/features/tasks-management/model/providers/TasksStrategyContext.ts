import type { UITask } from "@/entities/task";
import { createContext } from "react";

export type TasksStrategyContextValue = {
  uiTasks: UITask[];
  addTaskMutation: unknown;
  updateTaskMutation: unknown;
  deleteTaskMutation: unknown;
  toggleTaskMutation: unknown;
  deleteCompletedTasksMutation: unknown;
  markAllTasksCompletedMutation: unknown;
};

export const TasksStrategyContext =
  createContext<TasksStrategyContextValue | null>(null);
