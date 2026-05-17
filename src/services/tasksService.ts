import supabase from "@/shared/api/supabase/supabaseClient";
import { tasksAPI } from "@/entities/task/api/tasksAPI";
import { handleAxiosError } from "@/shared/lib/errors/handlers/handleAxiosError";
import { UserNotFoundError } from "@/shared/lib/errors/auth/UserNotFoundError";
import { useAppSettingsStore } from "@/stores/appSettingsStore";
import { SimulatedRequestError } from "@/shared/lib/errors/simulation/SimulatedRequestError";
import { SimulatedNetworkLikeError } from "@/shared/lib/errors/simulation/SimulatedNetworkLikeError";
import type { TaskDTO, CreateTaskDTO } from "@/entities/task/api/tasksAPI.types";

const randomTime = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getSimulationConfig = () => {
  const { isChaosMode } = useAppSettingsStore.getState();

  if (!isChaosMode) {
    return {
      enabled: false,
      minDelay: 0,
      maxDelay: 0,
      chanceHard: 0,
      chanceUnknownOutcome: 0,
    };
  }

  return {
    enabled: true,
    minDelay: 100,
    maxDelay: 5000,
    chanceHard: 0.5,
    chanceUnknownOutcome: 0.5,
  };
};

const simulateDelay = async () => {
  const { enabled, minDelay, maxDelay } = getSimulationConfig();
  if (!enabled) return;

  const delay = randomTime(minDelay, maxDelay);
  await new Promise((resolve) => setTimeout(resolve, delay));
};

const maybeFailHard = async () => {
  const { enabled, chanceHard } = getSimulationConfig();

  if (!enabled) return;

  if (Math.random() < chanceHard) {
    await simulateDelay();

    throw new SimulatedRequestError();
  }
};

const maybeFailWithUnknownOutcome = async () => {
  const { enabled, chanceUnknownOutcome } = getSimulationConfig();

  if (!enabled) return;

  await simulateDelay();

  if (Math.random() < chanceUnknownOutcome) {
    throw new SimulatedNetworkLikeError();
  }
};

const withErrorHandler = async <T>(func: () => Promise<T>): Promise<T> => {
  try {
    return await func();
  } catch (error) {
    return handleAxiosError(error);
  }
};

export const tasksService = {
  checkHealth: async (): Promise<boolean> => {
    try {
      await tasksAPI.checkHealth();
      return true;
    } catch {
      return false;
    }
  },

  getAll: async (): Promise<TaskDTO[]> =>
    withErrorHandler(async () => {
      const response = await tasksAPI.getAll();

      return response.data;
    }),

  addTask: async (task: CreateTaskDTO): Promise<TaskDTO[]> =>
    withErrorHandler(async () => {
      await maybeFailHard();

      const response = await tasksAPI.addTask(task);

      await maybeFailWithUnknownOutcome();

      return response.data;
    }),

  updateTaskInfo: async (
    taskId: string,
    title: string,
    description: string,
  ): Promise<void> =>
    withErrorHandler(async () => {
      await maybeFailHard();

      await tasksAPI.updateTaskInfo(taskId, title, description);

      await maybeFailWithUnknownOutcome();
    }),

  toggleTask: async (taskId: string, isDone: boolean): Promise<TaskDTO[]> =>
    withErrorHandler(async () => {
      await maybeFailHard();

      const response = await tasksAPI.toggleTask(taskId, isDone);

      await maybeFailWithUnknownOutcome();

      return response.data;
    }),

  deleteTask: async (taskId: string): Promise<void> =>
    withErrorHandler(async () => {
      await maybeFailHard();

      await tasksAPI.deleteTask(taskId);

      await maybeFailWithUnknownOutcome();
    }),

  markAllCompleted: async (): Promise<void> =>
    withErrorHandler(async () => {
      await maybeFailHard();

      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        throw new UserNotFoundError();
      }

      await tasksAPI.markAllCompleted(data.user.id);

      await maybeFailWithUnknownOutcome();
    }),

  deleteAll: async (): Promise<void> =>
    withErrorHandler(async () => {
      await maybeFailHard();

      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        throw new UserNotFoundError();
      }

      await tasksAPI.deleteAllTasks(data.user.id);

      await maybeFailWithUnknownOutcome();
    }),
};
