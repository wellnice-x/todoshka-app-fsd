import { QueryClient } from "@tanstack/react-query";
import type { Patch } from "@/features/tasks-management/model/strategies/patches/types";

export type HandleSyncPatchesFn = (
  syncPromise: Promise<void> | undefined,
) => Promise<void>;

export const createHandleSync = (
  queryClient: QueryClient,
  getUpdatedAt: () => number | undefined,
): HandleSyncPatchesFn => {
  return async (syncPromise) => {
    if (!syncPromise) return;

    try {
      const dataUpdatedBefore = getUpdatedAt();

      await syncPromise;

      const dataUpdatedAfter = getUpdatedAt();

      if (
        dataUpdatedAfter &&
        dataUpdatedBefore &&
        dataUpdatedAfter !== dataUpdatedBefore
      ) {
        queryClient.setQueryData<Patch[]>(["tasksPatches"], []);
      }
    } catch {
      queryClient.setQueryData<Patch[]>(["tasksPatches"], (old = []) =>
        old.filter((patch) => patch.operation !== "create"),
      );
    }
  };
};
