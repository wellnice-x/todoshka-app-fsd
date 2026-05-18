import { useAppRuntimeStore } from "@/app/model/appRuntimeStore";
import { OfflineError } from "@/shared/lib/errors/network/OfflineError";

export const throwIfOffline = () => {
  const { isNoInternetConnection } = useAppRuntimeStore.getState();

  if (isNoInternetConnection) {
    throw new OfflineError();
  }
};
