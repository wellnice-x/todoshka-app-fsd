import { UserNotFoundError } from "@/shared/lib/errors";
import { isNetworkError } from "@/shared/lib/errors";
import { TimeoutError } from "@/shared/lib/errors";
import { OfflineError } from "@/shared/lib/errors";
import toast from "react-hot-toast";

export const handleMutationError = (error: unknown) => {
  if (error instanceof UserNotFoundError) {
    toast.error("Seems like your session has expired");
    return true;
  }

  if (error instanceof OfflineError) {
    toast.error("No internet connection");
    return true;
  }

  if (error instanceof TimeoutError) {
    toast.error("Server didn't respond.\nRequest timeout");
    return true;
  }

  if (isNetworkError(error)) {
    toast("Interface may be outdated.\nPlease, wait for sync", {
      id: "networkErrorToast",
      icon: "⚠️",
    });
    return true;
  }

  return false;
};
