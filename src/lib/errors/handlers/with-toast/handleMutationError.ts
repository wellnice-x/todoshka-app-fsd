import { UserNotFoundError } from "@/lib/errors/auth/UserNotFoundError";
import { isNetworkError } from "@/lib/errors/errorUtils";
import { TimeoutError } from "@/lib/errors/network/TimeoutError";
import { OfflineError } from "@/lib/errors/network/OfflineError";
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
