import { useAppSettingsStore } from "@/stores/appSettingsStore";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const useOptimisticModeToast = () => {
  const optimisticMode = useAppSettingsStore((state) => state.optimisticMode);

  const firstPageLoadRef = useRef(true);
  const prevModeRef = useRef(optimisticMode);

  useEffect(() => {
    if (firstPageLoadRef.current) {
      firstPageLoadRef.current = false;
      prevModeRef.current = optimisticMode;
      return;
    }

    if (prevModeRef.current === optimisticMode) return;

    prevModeRef.current = optimisticMode;

    const modeLabels = {
      none: "None",
      snapshots: "Snapshots",
      patches: "Patches",
    } as const;

    toast.success(`Optimistic Mode set to ${modeLabels[optimisticMode]}`, {
      icon: "⚙️",
    });
  }, [optimisticMode]);
};

export default useOptimisticModeToast;
