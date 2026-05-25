import type {
  DeleteCompletedTasksMutation,
  MarkAllTasksCompletedMutation,
} from "@/features/tasks-management";

import { useAnimationStore } from "@/shared/lib/animation";
import {
  handleMutationError,
  handleBulkMutationError,
} from "@/shared/lib/error-handlers";
import { toast } from "react-hot-toast";

type Mutations = {
  deleteCompletedTasksMutation: DeleteCompletedTasksMutation;
  markAllTasksCompletedMutation: MarkAllTasksCompletedMutation;
};

export const useTasksBulkActions = ({
  deleteCompletedTasksMutation,
  markAllTasksCompletedMutation,
}: Mutations) => {
  const allowTasksAnimation = useAnimationStore(
    (state) => state.allowTasksAnimation,
  );

  const deleteCompletedTasks = (taskIds: string[]) => {
    if (deleteCompletedTasksMutation.isPending) return;

    allowTasksAnimation();

    deleteCompletedTasksMutation.mutate(
      { taskIds },
      {
        onSuccess: () => {
          toast.success("Completed tasks deleted");
        },
        onError: (error) => {
          handleBulkMutationError(error);
        },
      },
    );
  };

  const markAllTasksCompleted = () => {
    if (markAllTasksCompletedMutation.isPending) return;

    markAllTasksCompletedMutation.mutate(undefined, {
      onError: (error) => {
        if (handleMutationError(error)) return;

        toast.error("Server sync failed");
      },
    });
  };

  return { deleteCompletedTasks, markAllTasksCompleted };
};
