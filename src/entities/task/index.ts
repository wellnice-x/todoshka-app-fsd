export { tasksAPI } from "./api/tasksAPI";
export { tasksService } from "./api/tasksService";
export type { TaskDTO, CreateTaskDTO } from "./api/tasksAPI.types";

export { mapFromDTO, mapToDTO } from "./lib/taskMapper";

export { fallbackTasks } from "./mocks/fallbackTasks";

export { useTaskStableActions } from "./model/hooks/useTasksStableActions";
export { useTasksWithUIKeys } from "./model/hooks/useTasksWithUIKeys";
export { useIsTasksMutating } from "./model/query/useIsTasksMutating";
export { tasksUseCases } from "./model/use-cases/tasksUseCases";

export { useUIKeyStore } from "./model/uiKeyStore";
export type { Task, UITask, CreateTaskPayload } from "./model/task.types";