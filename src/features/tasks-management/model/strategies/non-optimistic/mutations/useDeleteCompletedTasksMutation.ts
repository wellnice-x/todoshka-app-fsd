import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useTasksNonOptimisticRuntime } from "../runtime/useTasksNonOptimisticRuntime";

export const useDeleteCompletedTasksMutation = () => {
  const { queryClient, optimisticMode, syncWithOptionalToast } =
    useTasksNonOptimisticRuntime();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "bulkDelete"],

    mutationFn: ({ taskIds }: { taskIds: string[] }) => {
      throwIfOffline();

      return tasksUseCases.deleteSome(taskIds);
    },

    onSuccess: (_data, vars) => {
      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        old.filter((task) => !vars.taskIds.includes(task.id)),
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error, 0, true);
    },
  });
};
