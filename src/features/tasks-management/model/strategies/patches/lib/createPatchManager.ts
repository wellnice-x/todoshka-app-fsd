import type {
  Patch,
  PatchOperation,
} from "@/features/tasks-management/model/strategies/patches/types";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { Task } from "@/entities/task";
import { PATCHES_QUERY_KEY } from "@/features/tasks-management/model/strategies/patches/config";


export const createPatchManager = (
  queryClient: QueryClient,
  queryKey: QueryKey,
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

    queryClient.setQueryData<Patch[]>(PATCHES_QUERY_KEY, (old = []) => {
      const filteredOld = entityId
        ? old.filter((patch) => patch.entityId !== entityId)
        : old;

      return [...filteredOld, patch];
    });

    return patch;
  };

  const removePatch = (patchId: string) => {
    queryClient.setQueryData<Patch[]>(PATCHES_QUERY_KEY, (old = []) =>
      old.filter((patch) => patch.id !== patchId),
    );
  };

  const commitPatch = (patch: Patch) => {
    queryClient.setQueryData<Task[]>(queryKey, (old = []) =>
      patch.apply(old),
    );
  };

  return {
    addPatch,
    removePatch,
    commitPatch,
  };
};
