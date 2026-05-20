import type { Task } from "@/entities/task/model/task.types";

export const fallbackTasks = (): Task[] => {
  return [
    {
      id: "fallback-1",
      title: "Example task: Pet the cat",
      description: "",
      isDone: true,
      orderIndex: 0,
      createdAt: new Date(),
    },
    {
      id: "fallback-2",
      title: "Example task: Throw out the trash",
      description: "",
      isDone: true,
      orderIndex: 1,
      createdAt: new Date(),
    },
    {
      id: "fallback-3",
      title: "Example task: Go to the hairdresser",
      description: "",
      isDone: false,
      orderIndex: 2,
      createdAt: new Date(),
    },
    {
      id: "fallback-4",
      title:
        "Example task: Celebrate a friend's birthday on Saturday at 2:00 am",
      description: "",
      isDone: false,
      orderIndex: 3,
      createdAt: new Date(),
    },
    {
      id: "fallback-5",
      title: "Example task: Finish the report",
      description: "",
      isDone: false,
      orderIndex: 4,
      createdAt: new Date(),
    },
  ];
};