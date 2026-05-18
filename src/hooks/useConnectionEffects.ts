import { useConnection } from "@/shared/api/network/model/connectionStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const useConnectionEffects = () => {
  const { hasConnectionJustLost, hasConnectionJustRecovered } = useConnection();

  useEffect(() => {
    if (hasConnectionJustLost) {
      toast.error("Connection lost", {
        icon: "⚠️",
        id: "connectionLostToast",
      });
    }
  }, [hasConnectionJustLost]);

  useEffect(() => {
    if (hasConnectionJustRecovered) {
      toast.success("Connection recovered", {
        id: "connectionRecoveredToast",
      });
    }
  }, [hasConnectionJustRecovered]);
};

export default useConnectionEffects;
