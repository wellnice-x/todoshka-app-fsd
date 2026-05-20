import { useAuth } from "@/shared/auth";
import { TimeoutError } from "@/shared/lib/errors";
import { useSettingsStore } from "@/shared/model/settings";
import { useGlobalErrorStore } from "@/shared/model/errors/globalErrorStore";

export const useLoadErrorStatus = (error: unknown) => {
  const { isAuthenticated, isUncertain } = useAuth();

  const isOfflineMode = useSettingsStore((state) => state.isOfflineMode);
  const loadErrorShown = useGlobalErrorStore((state) => state.loadErrorShown);

  if (loadErrorShown || isOfflineMode || isUncertain) {
    return null;
  }

  if (!isAuthenticated) {
    return "auth";
  }

  if (error instanceof Error) {
    if (error instanceof TimeoutError) {
      return "timeout";
    }
    return "server";
  }

  return null;
};
