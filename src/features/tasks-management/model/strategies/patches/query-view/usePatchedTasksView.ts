import { useQuery } from "@tanstack/react-query";
import { applyPatches } from "../lib/applyPatches";
import { useSettingsStore } from "@/shared/model/settings";
import { useEffect, useMemo } from "react";
import { useTasksWithUIKeys, useUIKeyStore } from "@/entities/task";
import type { Task } from "@/entities/task";
import type { Patch } from "../types";

export const usePatchedTasksView = () => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  const { cleanupUIKeys } = useUIKeyStore.getState();

  const { data = [] } = useQuery<Task[]>({
    queryKey: ["tasks", optimisticMode],
    queryFn: () => [],
    enabled: false,
  });

  const { data: patches = [] } = useQuery<Patch[]>({
    queryKey: ["tasksPatches"],
    queryFn: () => [],
    enabled: false,
  });

  const mergedTasks = useMemo(() => {
    return applyPatches(data, patches);
  }, [data, patches]);

  const tasks = useTasksWithUIKeys(mergedTasks);

  useEffect(() => {
    if (optimisticMode !== "patches") return;

    cleanupUIKeys(tasks.map((task) => task.id));
  }, [tasks, cleanupUIKeys, optimisticMode]);

  return tasks;
};
