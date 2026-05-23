export type AddTaskVariables = {
  title: string;
};

export type UpdateTaskInfoVariables = {
  taskId: string;
  title: string;
  description: string;
};

export type DeleteTaskVariables = {
  taskId: string;
};

export type ToggleTaskVariables = {
  taskId: string;
  newIsDone: boolean;
};

export type DeleteCompletedTasksVariables = {
  taskIds: string[];
};