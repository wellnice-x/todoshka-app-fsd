import { TimeoutError } from "@/shared/lib/errors/network/TimeoutError";
import { useGlobalErrorStore } from "@/app/model/globalErrorStore";
import { useAppSettingsStore } from "@/app/model/settings/appSettingsStore";
import useAuth from "@/hooks/useAuth";

const useLoadErrorStatus = (error: unknown) => {
  const { isAuthenticated, isUncertain } = useAuth();

  const isOfflineMode = useAppSettingsStore((state) => state.isOfflineMode);
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

export default useLoadErrorStatus;
