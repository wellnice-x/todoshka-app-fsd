import { useAppRuntime } from "@/stores/appRuntimeStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const useSettingsAutoDisableToast = () => {
  const { settingsAutoDisabled, unmarkSettingsDisabled } = useAppRuntime();

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

export default useSettingsAutoDisableToast;
