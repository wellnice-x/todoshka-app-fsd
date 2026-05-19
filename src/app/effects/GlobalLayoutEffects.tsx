import { useSlowServerToast } from "@/app/model";
import { useConnectionManager } from "@/app/model";
import { useAuthCheckingToast } from "@/app/model";
import { useConnectionEffects } from "@/app/model";
import { useGlobalLoadErrorToast } from "@/app/model";
import { useSettingsAutoDisableToast } from "@/app/model";

const GlobalLayoutEffects = () => {
  useSlowServerToast();
  useAuthCheckingToast();
  useGlobalLoadErrorToast();
  useSettingsAutoDisableToast();

  useConnectionManager();
  useConnectionEffects();

  return null;
};

export default GlobalLayoutEffects;