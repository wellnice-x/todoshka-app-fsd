export { tasksAPI } from "./api/tasksAPI";
export { tasksService } from "./api/tasksService";
export type { TaskDTO, CreateTaskDTO } from "./api/tasksAPI.types";

export { mapFromDTO, mapToDTO } from "./lib/taskMapper";

export { fallbackTasks } from "./mocks/fallbackTasks";

export { tasksUseCases } from "./model/use-cases/tasksUseCases";

export { useUIKeyStore } from "./model/uiKeyStore";
export type { Task, UITask, CreateTaskPayload } from "./model/task.types";