import { useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useSlowServerToast = () => {
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