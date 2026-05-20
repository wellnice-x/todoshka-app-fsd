import { useSettingsStore } from "@/shared/model/settings";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export const useOptimisticModeToast = () => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

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