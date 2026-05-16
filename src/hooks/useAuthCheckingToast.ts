import { useEffect } from "react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

const useAuthCheckingToast = () => {
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

export default useAuthCheckingToast;
