import { useRuntimeStore } from "@/shared/model/runtime";
import { OfflineError } from "@/shared/lib/errors";

export const throwIfOffline = () => {
  const { isNoInternetConnection } = useRuntimeStore.getState();

  if (isNoInternetConnection) {
    throw new OfflineError();
  }
};
