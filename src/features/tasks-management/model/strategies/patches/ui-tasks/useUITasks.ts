import type { Patch } from "../types";
import type { Task } from "@/entities/task";

import { QUERY_KEY, PATCHES_QUERY_KEY } from "../queryKeys";
import { applyPatches } from "../core/applyPatches";
import { useTasksWithUIKeys } from "@/features/tasks-management";
import { tasksUseCases } from "@/entities/task";
import { useServerAccessState } from "@/shared/model";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

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
