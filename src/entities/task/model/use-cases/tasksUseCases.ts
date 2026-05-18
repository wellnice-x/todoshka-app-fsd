import type { CreateTaskPayload } from "@/entities/task/model/types/task";
import { ensureMutationNotBlocked } from "./lib/ensureMutationNotBlocked";
import { mapFromDTO, mapToDTO } from "@/entities/task/lib/mappers/taskMapper";
import { BulkDeleteError } from "@/shared/lib/errors/mutations/BulkDeleteError";
import { tasksService } from "@/entities/task/model/services/tasksService";

export type TasksUseCases = typeof tasksUseCases;

export const tasksUseCases = {
  getAll: async () => {
    const tasksDTO = await tasksService.getAll();

    return tasksDTO.map(mapFromDTO);
  },

  addTask: async (task: CreateTaskPayload) => {
    await ensureMutationNotBlocked();

    if (!task.title || task.title.trim() === "") {
      throw new Error("Task title is required");
    }

    const tasksDTO = await tasksService.addTask(mapToDTO(task));

    return mapFromDTO(tasksDTO[0]);
  },

  updateTaskInfo: async (id: string, title: string, description: string) => {
    await ensureMutationNotBlocked();

    if (!id) {
      throw new Error("Task ID is required");
    }

    if (!title || title.trim() === "") {
      throw new Error("Task title is required");
    }

    return tasksService.updateTaskInfo(id, title, description);
  },

  toggleTask: async (id: string, isDone: boolean) => {
    await ensureMutationNotBlocked();

    if (!id) {
      throw new Error("Task ID is required");
    }

    const tasksDTO = await tasksService.toggleTask(id, isDone);

    return mapFromDTO(tasksDTO[0]);
  },

  deleteTask: async (id: string) => {
    await ensureMutationNotBlocked();

    if (!id) {
      throw new Error("Task ID is required");
    }

    return tasksService.deleteTask(id);
  },

  deleteSome: async (taskIds: string[]) => {
    await ensureMutationNotBlocked();

    if (!taskIds.length) return [];

    const results = await Promise.allSettled(
      taskIds.map(async (taskId) => {
        await tasksService.deleteTask(taskId);
        return { taskId };
      }),
    );

    const hasError = results.some((result) => result.status === "rejected");

    if (hasError) {
      throw new BulkDeleteError(results);
    }

    return results;
  },

  markAllCompleted: async () => {
    await ensureMutationNotBlocked();

    return tasksService.markAllCompleted();
  },
};
