import { isNetworkError } from "@/shared/lib/errors/errorUtils";
import { useRuntimeStore } from "@/app/model";
import { handlePromiseWithToast } from "@/shared/lib/toast/handlePromiseWithToast";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query/useQuerySyncScheduler";

export const useQuerySyncWithOptionalToast = (
  scheduleQuerySync: ScheduleQuerySyncFn,
) => {
  return (
    error?: unknown,
    delay?: number,
    showWithAnyError: boolean = false,
  ): Promise<void> | undefined => {
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
