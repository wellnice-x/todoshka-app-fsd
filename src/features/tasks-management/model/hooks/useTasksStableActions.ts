import type {
  ToggleTaskMutation,
  DeleteTaskMutation,
  ToggleTaskAction,
  DeleteTaskAction,
} from "@/features/tasks-management/model/types";

import { useCallback, useEffect, useRef } from "react";

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

  const toggleTask: ToggleTaskAction = useCallback(
    (taskId: string, newIsDone: boolean) => {
      return toggleRef.current({ taskId, newIsDone });
    },
    [],
  );

  const deleteTask: DeleteTaskAction = useCallback((taskId: string) => {
    return deleteRef.current({ taskId });
  }, []);

  return { toggleTask, deleteTask };
};
