import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/runtime/useStrategyRuntime";
import {
  QUERY_KEY,
  createMutationKey,
} from "@/features/tasks-management/model/strategies/non-optimistic/config";

export const useAddTaskMutation = () => {
  const { queryClient, syncWithOptionalToast } = useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("add"),

    mutationFn: ({ title }: { title: string }) => {
      throwIfOffline();

      return tasksUseCases.addTask({
        title,
        description: "",
        isDone: false,
      });
    },

    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) => [
        ...old,
        newTask,
      ]);
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });
};
