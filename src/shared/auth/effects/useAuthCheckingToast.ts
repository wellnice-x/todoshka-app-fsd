import { useAuth } from "../provider/useAuth";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useAuthCheckingToast = () => {
  const { authStatus } = useAuth();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (authStatus === "checking") {
      timeout = setTimeout(() => {
        toast.loading("Authenticating...", { id: "authCheckingToast" });
      }, 300);
    } else {
      toast.dismiss("authCheckingToast");
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      } 
    };
  }, [authStatus]);
};
