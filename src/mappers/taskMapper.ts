import type { Task } from "../types/task";
import type { TaskDTO } from "../api/tasksAPI.types";

export const mapFromDTO = (task: TaskDTO): Task => ({
  id: task.id,
  title: task.title,
  description: task.description,
  isDone: task.is_done,
  orderIndex: task.order_index,
  createdAt: task.created_at,
});

export const mapToDTO = (
  task: Pick<Task, "title" | "description" | "isDone">,
): Pick<TaskDTO, "title" | "description" | "is_done"> => ({
  title: task.title,
  description: task.description,
  is_done: task.isDone,
});
