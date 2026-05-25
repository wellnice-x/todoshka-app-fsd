import type { TaskDTO, CreateTaskDTO } from "./tasksAPI.types";

import { axiosClient } from "@/shared/api";

export const tasksAPI = {
  getAll: () => axiosClient.get<TaskDTO[]>(`/tasks?order=order_index.asc`),

  addTask: (task: CreateTaskDTO) =>
    axiosClient.post<TaskDTO[]>(`/tasks`, task, {
      headers: {
        Prefer: "return=representation",
      },
    }),

  updateTaskInfo: (taskId: string, title: string, description: string) =>
    axiosClient.patch(`/tasks?id=eq.${taskId}`, { title, description }),

  toggleTask: (taskId: string, isDone: boolean) =>
    axiosClient.patch<TaskDTO[]>(
      `/tasks?id=eq.${taskId}`,
      { is_done: isDone },
      {
        headers: {
          Prefer: "return=representation",
        },
      },
    ),

  deleteTask: (taskId: string) => axiosClient.delete(`/tasks?id=eq.${taskId}`),

  markAllTasksCompleted: (userId: string) =>
    axiosClient.patch<TaskDTO[]>(`/tasks?user_id=eq.${userId}`, {
      is_done: true,
    }),

  deleteAllTasks: (userId: string) =>
    axiosClient.delete(`/tasks?user_id=eq.${userId}`),
};
