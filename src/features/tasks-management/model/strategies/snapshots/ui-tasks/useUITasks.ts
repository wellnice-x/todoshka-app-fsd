import type { Task } from "@/entities/task";
import { useQuery } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { useTasksWithUIKeys } from "@/features/tasks-management";
import { useServerAccessState } from "@/shared/model/access/useServerAccessState";
import { QUERY_KEY } from "@/features/tasks-management/model/strategies/snapshots/config";

export const useUITasks = () => {
  const { isServerAccessBlocked } = useServerAccessState();

  const { data = [] } = useQuery<Task[]>({
    queryKey: QUERY_KEY,
    queryFn: tasksUseCases.getAll,
    enabled: !isServerAccessBlocked,
  });

  const uiTasks = useTasksWithUIKeys(data);

  return uiTasks;
};
