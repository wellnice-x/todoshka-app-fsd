import type { Task } from "@/entities/task";

import { useStrategyRuntime } from "../runtime/useStrategyRuntime";
import { QUERY_KEY, createMutationKey } from "../queryKeys";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useMutation } from "@tanstack/react-query";

export const useToggleTaskMutation = () => {
  const { queryClient, syncWithOptionalToast } = useStrategyRuntime();

  return useMutation({
    mutationKey: createMutationKey("toggle"),

    mutationFn: ({
      taskId,
      newIsDone,
    }: {
      taskId: string;
      newIsDone: boolean;
    }) => {
      throwIfOffline();

      return tasksUseCases.toggleTask(taskId, newIsDone);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        old.map((task) =>
          task.id === vars.taskId ? { ...task, isDone: vars.newIsDone } : task,
        ),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });
};
