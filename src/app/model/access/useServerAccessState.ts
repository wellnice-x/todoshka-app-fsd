import { useSettingsStore } from "@/app/model";
import { useRuntimeStore } from "@/app/model";
import { useAuth } from "@/app/model";

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