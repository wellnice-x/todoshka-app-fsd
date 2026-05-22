import type { Patch } from "@/features/tasks-management/model/strategies/patches/types";
import type { Task } from "@/entities/task";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { applyPatches } from "@/features/tasks-management/model/strategies/patches/lib/applyPatches";
import { useSettingsStore } from "@/shared/model/settings";
import { useServerAccessState } from "@/shared/model/access/useServerAccessState";
import { tasksUseCases, useTasksWithUIKeys } from "@/entities/task";

export const usePatchUITasks = () => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  const { isServerAccessBlocked } = useServerAccessState();

  const { data = [] } = useQuery<Task[]>({
    queryKey: ["tasks", optimisticMode],
    queryFn: tasksUseCases.getAll,
    enabled: optimisticMode === "patches" && !isServerAccessBlocked,
  });

  const { data: patches = [] } = useQuery<Patch[]>({
    queryKey: ["tasksPatches"],
    queryFn: () => [],
    enabled: false,
    initialData: [],
  });

  const mergedTasks = useMemo(() => {
    const serverTasks = data ?? [];

    return patches.length ? applyPatches(serverTasks, patches) : serverTasks;
  }, [data, patches]);

  const uiTasks = useTasksWithUIKeys(mergedTasks);

  return uiTasks;
};
