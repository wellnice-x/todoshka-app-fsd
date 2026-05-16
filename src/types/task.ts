export type Task = {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  orderIndex: number;
  createdAt: Date;
};

export type CreateTaskPayload = {
  title: string;
  description: string;
  isDone: boolean;
};

export type UITask = Task & {
  __uiKey: string;
};
