import type { Task } from "@/entities/task";

export type ToggleTaskAction = (
  taskId: string,
  newIsDone: boolean,
) => Promise<Task | undefined>;

export type DeleteTaskAction = (taskId: string) => Promise<void>;