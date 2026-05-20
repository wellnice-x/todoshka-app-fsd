import type { TaskDTO, CreateTaskDTO } from "./tasksAPI.types";
import {
  maybeFailHard,
  maybeFailWithUnknownOutcome,
  getSimulationConfig,
} from "@/shared/lib/simulation";
import { handleAxiosError } from "@/shared/lib/errors";
import { getCurrentUserId } from "@/shared/auth";
import { tasksAPI } from "@/entities/task/api/tasksAPI";

const withErrorHandler = async <T>(func: () => Promise<T>): Promise<T> => {
  try {
    return await func();
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const tasksService = {
  getAll: async (): Promise<TaskDTO[]> =>
    withErrorHandler(async () => {
      const response = await tasksAPI.getAll();

      return response.data;
    }),

  addTask: async (task: CreateTaskDTO): Promise<TaskDTO[]> =>
    withErrorHandler(async () => {
      await maybeFailHard(getSimulationConfig());

      const response = await tasksAPI.addTask(task);

      await maybeFailWithUnknownOutcome(getSimulationConfig());

      return response.data;
    }),

  updateTaskInfo: async (
    taskId: string,
    title: string,
    description: string,
  ): Promise<void> =>
    withErrorHandler(async () => {
      await maybeFailHard(getSimulationConfig());

      await tasksAPI.updateTaskInfo(taskId, title, description);

      await maybeFailWithUnknownOutcome(getSimulationConfig());
    }),

  toggleTask: async (taskId: string, isDone: boolean): Promise<TaskDTO[]> =>
    withErrorHandler(async () => {
      await maybeFailHard(getSimulationConfig());

      const response = await tasksAPI.toggleTask(taskId, isDone);

      await maybeFailWithUnknownOutcome(getSimulationConfig());

      return response.data;
    }),

  deleteTask: async (taskId: string): Promise<void> =>
    withErrorHandler(async () => {
      await maybeFailHard(getSimulationConfig());

      await tasksAPI.deleteTask(taskId);

      await maybeFailWithUnknownOutcome(getSimulationConfig());
    }),

  markAllCompleted: async (): Promise<void> =>
    withErrorHandler(async () => {
      await maybeFailHard(getSimulationConfig());

      const userId = await getCurrentUserId();

      await tasksAPI.markAllCompleted(userId);

      await maybeFailWithUnknownOutcome(getSimulationConfig());
    }),

  deleteAll: async (): Promise<void> =>
    withErrorHandler(async () => {
      await maybeFailHard(getSimulationConfig());

      const userId = await getCurrentUserId();

      await tasksAPI.deleteAllTasks(userId);

      await maybeFailWithUnknownOutcome(getSimulationConfig());
    }),
};
