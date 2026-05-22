import type { Patch, PatchOperation } from "../types";
import type { QueryClient } from "@tanstack/react-query";
import type { Task } from "@/entities/task";

export const createPatchManager = (
  queryClient: QueryClient,
  optimisticMode: string,
) => {
  const addPatch = (
    apply: Patch["apply"],
    operation: PatchOperation,
    entityId?: string,
  ) => {
    const id = crypto.randomUUID();

    const patch: Patch = {
      id,
      apply,
      operation,
      entityId,
    };

    queryClient.setQueryData<Patch[]>(["tasksPatches"], (old = []) => {
      const filteredOld = entityId
        ? old.filter((patch) => patch.entityId !== entityId)
        : old;

      return [...filteredOld, patch];
    });

    return patch;
  };

  const removePatch = (patchId: string) => {
    queryClient.setQueryData<Patch[]>(["tasksPatches"], (old = []) =>
      old.filter((patch) => patch.id !== patchId),
    );
  };

  const commitPatch = (patch: Patch) => {
    queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
      patch.apply(old),
    );
  };

  return {
    addPatch,
    removePatch,
    commitPatch,
  };
};
