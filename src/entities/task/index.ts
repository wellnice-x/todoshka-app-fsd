export { tasksAPI } from "./api/tasksAPI";
export type { TaskDTO, CreateTaskDTO } from "./api/tasksAPI.types";

export { mapFromDTO, mapToDTO } from "./lib/mappers/taskMapper";

export { fallbackTasks } from "./mocks/fallbackTasks";

export { tasksService } from "./model/services/tasksService";
export { tasksUseCases } from "./model/use-cases/tasksUseCases";
export { useUIKeyStore } from "./model/uiKeyStore";
export type { Task, UITask, CreateTaskPayload } from "./model/types/task";
