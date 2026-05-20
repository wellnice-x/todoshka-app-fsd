import { useCallback, useEffect, useRef } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import type { Task } from "@/entities/task/model/task.types";

type ToggleTaskVariables = {
  taskId: string;
  newIsDone: boolean;
};

type DeleteTaskVariables = {
  taskId: string;
};

type Mutations = {
  toggleTaskMutation: UseMutationResult<
    Task | undefined,
    Error,
    ToggleTaskVariables
  >;
  deleteTaskMutation: UseMutationResult<void, Error, DeleteTaskVariables>;
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
