import useSlowServerToast from "@/hooks/useSlowServerToast";
import useConnectionManager from "@/hooks/useConnectionManager";
import useAuthCheckingToast from "@/hooks/useAuthCheckingToast";
import useConnectionEffects from "@/hooks/useConnectionEffects";
import useGlobalLoadErrorToast from "@/hooks/useGlobalLoadErrorToast";
import useSettingsAutoDisableToast from "@/hooks/useSettingsAutoDisableToast";

const GlobalLayoutEffects = () => {
  useSlowServerToast();
  useAuthCheckingToast();
  useConnectionManager();
  useConnectionEffects();
  useGlobalLoadErrorToast();
  useSettingsAutoDisableToast();

  return null;
};

export default GlobalLayoutEffects;