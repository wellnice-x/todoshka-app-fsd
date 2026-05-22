import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSettingsStore } from "@/shared/model/settings";
import { useTasksWithUIKeys, useUIKeyStore } from "@/entities/task";
import type { Task } from "@/entities/task";

export const useNonOptimisticTasksView = () => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  const { cleanupUIKeys } = useUIKeyStore.getState();

  const { data = [] } = useQuery<Task[]>({
    queryKey: ["tasks", optimisticMode],
    queryFn: () => [],
    enabled: false,
  });

  const tasks = useTasksWithUIKeys(data);

  useEffect(() => {
    if (optimisticMode !== "none") return;

    cleanupUIKeys(tasks.map((task) => task.id));
  }, [tasks, cleanupUIKeys, optimisticMode]);

  return tasks;
};
