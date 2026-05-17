export type TaskDTO = {
  id: string;
  title: string;
  description: string;
  is_done: boolean;
  order_index: number;
  created_at: Date;
};

export type CreateTaskDTO = Pick<TaskDTO, "title" | "description" | "is_done">;
