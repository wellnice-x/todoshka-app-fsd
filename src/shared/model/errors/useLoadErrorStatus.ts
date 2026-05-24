import { useAuth } from "@/shared/auth";
import { TimeoutError } from "@/shared/lib/errors";
import { useSettingsStore } from "../settings/settingsStore";
import { useGlobalErrorStore } from "../errors/globalErrorStore";

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
