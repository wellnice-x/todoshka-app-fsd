import type { Task } from "@/entities/task";
import { useQuery } from "@tanstack/react-query";
import { useSettingsStore } from "@/shared/model/settings";
import { useServerAccessState } from "@/shared/model/access/useServerAccessState";
import { tasksUseCases, useTasksWithUIKeys } from "@/entities/task";

export const useNonOptimisticUITasks = () => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  const { isServerAccessBlocked } = useServerAccessState();

  const { data = [] } = useQuery<Task[]>({
    queryKey: ["tasks", optimisticMode],
    queryFn: tasksUseCases.getAll,
    enabled: optimisticMode === "none" && !isServerAccessBlocked,
  });

  const uiTasks = useTasksWithUIKeys(data);

  return uiTasks;
};
