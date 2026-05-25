import type { Task } from "@/entities/task";
import type { UseMutationResult } from "@tanstack/react-query";

import type {
  AddTaskVariables,
  DeleteTaskVariables,
  ToggleTaskVariables,
  UpdateTaskInfoVariables,
  DeleteCompletedTasksVariables,
} from "./variables";

export type AddTaskMutation = UseMutationResult<
  Task | undefined,
  Error,
  AddTaskVariables
>;

export type UpdateTaskInfoMutation = UseMutationResult<
  void,
  Error,
  UpdateTaskInfoVariables
>;

export type DeleteTaskMutation = UseMutationResult<
  void,
  Error,
  DeleteTaskVariables
>;

export type ToggleTaskMutation = UseMutationResult<
  Task | undefined,
  Error,
  ToggleTaskVariables
>;

export type DeleteCompletedTasksMutation = UseMutationResult<
  PromiseSettledResult<{ taskId: string }>[] | undefined,
  Error,
  DeleteCompletedTasksVariables
>;

export type MarkAllTasksCompletedMutation = UseMutationResult<
  void,
  Error,
  void
>;
