import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

type Messages = {
  loading?: string;
  success?: string;
  error?: string;
};

export const handlePromiseWithToast = async (
  promise: Promise<void>,
  messages?: Messages,
  successDuration: number = 6000,
  successIcon: string = "🔧👀",
) => {
  return toast.promise(
    promise,
    {
      loading: messages?.loading ?? "Syncing...",
      success: messages?.success ?? "Synced",
      error: messages?.error ?? "Sync failed",
    },
    {
      id: "syncToast",

      loading: {
        icon: <ClipLoader size={12} color="#0000007b" />,
      },

      success: {
        icon: successIcon,
        duration: successDuration,
      },

      error: {
        icon: "❌",
      },
    },
  );
};
