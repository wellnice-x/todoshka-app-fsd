import type { Task } from "@/entities/task";

import { QUERY_KEY } from "../queryKeys";
import { useTasksWithUIKeys } from "@/features/tasks-management/model/hooks/useTasksWithUIKeys";
import { tasksUseCases } from "@/entities/task";
import { useServerAccessState } from "@/shared/model";
import { useQuery } from "@tanstack/react-query";

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
