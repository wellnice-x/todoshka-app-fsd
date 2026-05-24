import { tasksUseCases, type Task } from "@/entities/task";
import { useQuery } from "@tanstack/react-query";
import { useSettingsStore } from "@/shared/model";

export const useTasksQueryState = () => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  const { data, error, isLoading, isRefetching, isFetching } = useQuery<Task[]>(
    {
      queryKey: ["tasks", optimisticMode],
      queryFn: tasksUseCases.getAll,
      enabled: false,
    },
  );

  return {
    data,
    error,
    isLoading,
    isRefetching,
    isFetching,
  };
};
