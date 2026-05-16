import type { Task, CreateTaskPayload } from "@/types/task";
import { SimulatedBlockedMutationError } from "@/shared/lib/errors/simulation/SimulatedBlockedMutationError";
import { mapFromDTO, mapToDTO } from "@/mappers/taskMapper";
import { useAppSettingsStore } from "@/stores/appSettingsStore";
import { BulkDeleteError } from "@/shared/lib/errors/mutations/BulkDeleteError";
import { tasksService } from "@/services/tasksService";

type UseTasksServiceResult = {
  getAll: () => Promise<Task[]>;
  addTask: (task: CreateTaskPayload) => Promise<Task>;
  updateTaskInfo: (
    id: string,
    title: string,
    description: string,
  ) => Promise<void>;
  toggleTask: (id: string, isDone: boolean) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  markAllCompleted: () => Promise<void>;
  deleteSome: (
    taskIds: string[],
  ) => Promise<PromiseSettledResult<{ taskId: string }>[]>;
};

export const useTasksService = (): UseTasksServiceResult => {
  const isBlockMutation = useAppSettingsStore((state) => state.isBlockMutation);

  const maybeBlockMutation = async () => {
    if (!isBlockMutation) return;

    await new Promise<never>((_, reject) =>
      setTimeout(() => reject(new SimulatedBlockedMutationError()), 300),
    );
  };

  const getAll = async () => {
    const tasksDTO = await tasksService.getAll();

    return tasksDTO.map(mapFromDTO);
  };

  const addTask = async (task: CreateTaskPayload) => {
    await maybeBlockMutation();

    if (!task.title || task.title.trim() === "") {
      throw new Error("Task title is required");
    }

    const tasksDTO = await tasksService.addTask(mapToDTO(task));

    return mapFromDTO(tasksDTO[0]);
  };

  const updateTaskInfo = async (
    id: string,
    title: string,
    description: string,
  ) => {
    await maybeBlockMutation();

    if (!id) {
      throw new Error("Task ID is required");
    }

    if (!title || title.trim() === "") {
      throw new Error("Task title is required");
    }

    return tasksService.updateTaskInfo(id, title, description);
  };

  const toggleTask = async (id: string, isDone: boolean) => {
    await maybeBlockMutation();

    if (!id) {
      throw new Error("Task ID is required");
    }

    const tasksDTO = await tasksService.toggleTask(id, isDone);

    return mapFromDTO(tasksDTO[0]);
  };

  const deleteTask = async (id: string) => {
    await maybeBlockMutation();

    if (!id) {
      throw new Error("Task ID is required");
    }

    return tasksService.deleteTask(id);
  };

  const deleteSome = async (taskIds: string[]) => {
    await maybeBlockMutation();

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
  };

  const markAllCompleted = async () => {
    await maybeBlockMutation();

    return tasksService.markAllCompleted();
  };

  return {
    getAll,
    addTask,
    updateTaskInfo,
    toggleTask,
    deleteTask,
    deleteSome,
    markAllCompleted,
  };
};
