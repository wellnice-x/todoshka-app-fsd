import { useEffect } from "react";
import { useIsMutating } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useSlowServerToast = () => {
  const mutatingCount = useIsMutating();

  useEffect(() => {
    if (!mutatingCount) {
      toast.dismiss("slowServerToast");
      return;
    }

    const timer = setTimeout(() => {
      toast.loading("Server is responding slowly...", {
        id: "slowServerToast",
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, [mutatingCount]);
};

export default useSlowServerToast;
