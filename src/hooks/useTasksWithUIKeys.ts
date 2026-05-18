import type { Task, UITask } from "@/entities/task";
import { useMemo, useRef } from "react";
import { useUIKeyStore } from "@/entities/task";

const isSameTask = (a: Task, b: Task) =>
  a.title === b.title &&
  a.description === b.description &&
  a.isDone === b.isDone &&
  a.orderIndex === b.orderIndex;

const useTasksWithUIKeys = (data: Task[] | undefined): UITask[] => {
  const getUIKey = useUIKeyStore.getState().getUIKey;

  const prevTasksMapRef = useRef<Map<string, UITask>>(new Map());

  return useMemo(() => {
    const prevTasksMap = prevTasksMapRef.current;
    const nextTasksMap = new Map<string, UITask>();

    const tasksWithUIKeys = (data ?? []).map((currentTask) => {
      const prevTask = prevTasksMap.get(currentTask.id);

      const taskWithUIKey =
        prevTask && isSameTask(prevTask, currentTask)
          ? prevTask
          : {
              ...currentTask,
              __uiKey: prevTask?.__uiKey ?? getUIKey(currentTask.id),
            };

      nextTasksMap.set(currentTask.id, taskWithUIKey);
      return taskWithUIKey;
    });

    prevTasksMapRef.current = nextTasksMap;

    return tasksWithUIKeys;
  }, [data, getUIKey]);
};

export default useTasksWithUIKeys;
