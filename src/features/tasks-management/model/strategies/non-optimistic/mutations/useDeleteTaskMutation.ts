import type { Task } from "@/entities/task";

import { useStrategyRuntime } from "../runtime/useStrategyRuntime";
import { QUERY_KEY, createMutationKey } from "../queryKeys";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useMutation } from "@tanstack/react-query";

export const useDeleteTaskMutation = () => {
  const { queryClient, syncWithOptionalToast } = useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("delete"),

    mutationFn: ({ taskId }: { taskId: string }) => {
      throwIfOffline();

      return tasksUseCases.deleteTask(taskId);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData(QUERY_KEY, (old: Task[] = []) =>
        old.filter((task) => task.id !== vars.taskId),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });
};
