import type { ScheduleQuerySyncFn } from "./useQuerySyncScheduler";

import { isNetworkError } from "@/shared/lib/error-utils";
import { useRuntimeStore } from "@/shared/model";
import { handlePromiseWithToast } from "@/shared/lib/toast";

export type QuerySyncWithOptionalToastFn = (
  error?: unknown,
  delay?: number,
  showWithAnyError?: boolean,
) => Promise<void> | undefined;

export const useQuerySyncWithOptionalToast = (
  scheduleQuerySync: ScheduleQuerySyncFn,
): QuerySyncWithOptionalToastFn => {
  return (error, delay, showWithAnyError = false) => {
    const { isNoInternetConnection } = useRuntimeStore.getState();

    if (isNoInternetConnection) {
      return;
    }

    const shouldShowToast =
      error && (isNetworkError(error) || showWithAnyError);

    if (shouldShowToast) {
      return handlePromiseWithToast(scheduleQuerySync(delay, true, true), {
        loading: "Network issue. Re-syncing...",
        success: "Interface is up to date. \n Check your data",
        error: "Failed to sync. \n Please, refresh the page",
      });
    }

    return scheduleQuerySync(delay);
  };
};
