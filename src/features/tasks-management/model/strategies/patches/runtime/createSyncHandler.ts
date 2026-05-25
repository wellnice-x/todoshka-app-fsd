import type { Patch } from "../types";

import { PATCHES_QUERY_KEY } from "../queryKeys";
import { QueryClient } from "@tanstack/react-query";

export type HandleSyncPatchesFn = (
  syncPromise: Promise<void> | undefined,
) => Promise<void>;

export const createSyncHandler = (
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
        queryClient.setQueryData<Patch[]>(PATCHES_QUERY_KEY, []);
      }
    } catch {
      queryClient.setQueryData<Patch[]>(PATCHES_QUERY_KEY, (old = []) =>
        old.filter((patch) => patch.operation !== "create"),
      );
    }
  };
};
