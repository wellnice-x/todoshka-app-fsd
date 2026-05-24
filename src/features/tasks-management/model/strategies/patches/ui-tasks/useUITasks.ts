import type { Patch } from "@/features/tasks-management/model/strategies/patches/types";
import type { Task } from "@/entities/task";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { applyPatches } from "@/features/tasks-management/model/strategies/patches/lib/applyPatches";
import { tasksUseCases } from "@/entities/task";
import { useTasksWithUIKeys } from "@/features/tasks-management";
import { useServerAccessState } from "@/shared/model/access";
import {
  QUERY_KEY,
  PATCHES_QUERY_KEY,
} from "@/features/tasks-management/model/strategies/patches/config";

export const useUITasks = () => {
  const { isServerAccessBlocked } = useServerAccessState();

  const { data = [] } = useQuery<Task[]>({
    queryKey: QUERY_KEY,
    queryFn: tasksUseCases.getAll,
    enabled: !isServerAccessBlocked,
  });

  const { data: patches = [] } = useQuery<Patch[]>({
    queryKey: PATCHES_QUERY_KEY,
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
