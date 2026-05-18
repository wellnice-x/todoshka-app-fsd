import { useAppSettingsStore } from "@/app/model/settings/appSettingsStore";
import { useAppRuntimeStore } from "@/app/model/appRuntimeStore";
import useAuth from "./useAuth";

const useServerAccessState = () => {
  const isOfflineMode = useAppSettingsStore((state) => state.isOfflineMode);
  const isNoInternetConnection = useAppRuntimeStore(
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

export default useServerAccessState;
