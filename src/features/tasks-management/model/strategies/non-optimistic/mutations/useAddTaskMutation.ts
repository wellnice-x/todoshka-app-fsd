import type { Task } from "@/entities/task";
import { useMutation } from "@tanstack/react-query";
import { tasksUseCases } from "@/entities/task";
import { throwIfOffline } from "@/shared/lib/network";
import { useTasksNonOptimisticRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/runtime/useTasksNonOptimisticRuntime";

export const useAddTaskMutation = () => {
  const { queryClient, optimisticMode, syncWithOptionalToast } =
    useTasksNonOptimisticRuntime();

  return useMutation({
    mutationKey: ["tasks", optimisticMode, "add"],

    mutationFn: ({ title }: { title: string }) => {
      throwIfOffline();

      return tasksUseCases.addTask({
        title,
        description: "",
        isDone: false,
      });
    },

    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(
        ["tasks", optimisticMode],
        (old = []) => [...old, newTask],
      );
    },

    onSettled: (_data, error) => {
      syncWithOptionalToast(error);
    },
  });
};
