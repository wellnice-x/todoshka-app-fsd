import { useCallback, useEffect, useRef } from "react";
import type {
  ToggleTaskMutation,
  DeleteTaskMutation,
} from "@/features/tasks-management";

type Mutations = {
  toggleTaskMutation: ToggleTaskMutation;
  deleteTaskMutation: DeleteTaskMutation;
};

export const useTaskStableActions = ({
  toggleTaskMutation,
  deleteTaskMutation,
}: Mutations) => {
  const toggleRef = useRef(toggleTaskMutation.mutateAsync);
  const deleteRef = useRef(deleteTaskMutation.mutateAsync);

  useEffect(() => {
    toggleRef.current = toggleTaskMutation.mutateAsync;
    deleteRef.current = deleteTaskMutation.mutateAsync;
  }, [toggleTaskMutation.mutateAsync, deleteTaskMutation.mutateAsync]);

  const toggleTask = useCallback((taskId: string, newIsDone: boolean) => {
    return toggleRef.current({ taskId, newIsDone });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    return deleteRef.current({ taskId });
  }, []);

  return { toggleTask, deleteTask };
};
