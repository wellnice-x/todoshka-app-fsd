import { useEffect } from "react";

export const useNetworkListeners = (
  onOffline: () => void,
  onOnline: () => void,
) => {
  useEffect(() => {
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, [onOffline, onOnline]);
};