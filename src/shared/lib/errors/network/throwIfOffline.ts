import { useRuntimeStore } from "@/app/model";
import { OfflineError } from "@/shared/lib/errors/network/OfflineError";

export const throwIfOffline = () => {
  const { isNoInternetConnection } = useRuntimeStore.getState();

  if (isNoInternetConnection) {
    throw new OfflineError();
  }
};
