import { useRuntime } from "@/shared/model";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useSettingsAutoDisableToast = () => {
  const { settingsAutoDisabled, unmarkSettingsDisabled } = useRuntime();

  useEffect(() => {
    if (!settingsAutoDisabled) return;

    toast(
      "Some settings were disabled \n because Optimistic Mode \n is set to None",
      {
        icon: "⚠️",
      },
    );

    unmarkSettingsDisabled();
  }, [settingsAutoDisabled, unmarkSettingsDisabled]);
};