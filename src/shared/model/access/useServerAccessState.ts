import { useSettingsStore } from "@/shared/model/settings";
import { useRuntimeStore } from "@/shared/model/runtime";
import { useAuth } from "@/shared/auth";

export const useServerAccessState = () => {
  const isOfflineMode = useSettingsStore((state) => state.isOfflineMode);
  const isNoInternetConnection = useRuntimeStore(
    (state) => state.isNoInternetConnection,
  );

  const { isAuthenticated, isUncertain } = useAuth();

  return {
    isServerAccessBlocked: isOfflineMode || !isAuthenticated,
    isServerBlockedByAuth: !isAuthenticated,
    isServerBlockedByUser: isOfflineMode,
    isServerAccessUncertain: isUncertain,
    canAccessServer: !isNoInternetConnection && isAuthenticated,
  };
};