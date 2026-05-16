import { TimeoutError } from "@/lib/errors/network/TimeoutError";
import { useErrorStore } from "@/stores/errorStore";
import { useAppSettingsStore } from "@/stores/appSettingsStore";
import useAuth from "@/hooks/useAuth";

const useLoadErrorStatus = (error: unknown) => {
  const { isAuthenticated, isUncertain } = useAuth();

  const isOfflineMode = useAppSettingsStore((state) => state.isOfflineMode);
  const loadErrorShown = useErrorStore((state) => state.loadErrorShown);

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
