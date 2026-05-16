import { useAppRuntimeStore } from "@/stores/appRuntimeStore";
import { OfflineError } from "@/lib/errors/network/OfflineError";

export const throwIfOffline = () => {
  const { isNoInternetConnection } = useAppRuntimeStore.getState();

  if (isNoInternetConnection) {
    throw new OfflineError();
  }
};
