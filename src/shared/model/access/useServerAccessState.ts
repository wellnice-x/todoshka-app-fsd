import { useSettingsStore } from "../settings/settingsStore";
import { useRuntimeStore } from "../runtime/runtimeStore";
import { useAuth } from "@/shared/auth";

export const useServerAccessState = () => {
  const isOfflineMode = useSettingsStore((state) => state.isOfflineMode);
  const isNoInternetConnection = useRuntimeStore(
    (state) => state.isNoInternetConnection,
  );
  const isTestMode = useRuntimeStore((state) => state.isTestMode);

  const { isAuthenticated, isUncertain } = useAuth();

  return {
    isServerAccessBlocked: isOfflineMode || !isAuthenticated || isTestMode,
    isServerBlockedByAuth: !isAuthenticated,
    isServerBlockedByUser: isOfflineMode,
    isServerAccessUncertain: isUncertain,
    canAccessServer: !isNoInternetConnection && isAuthenticated && !isTestMode,
  };
};