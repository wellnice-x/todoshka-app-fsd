import { useSlowServerToast } from "./connection/useSlowServerToast";
import { useConnectionManager } from "./connection/useConnectionManager";
import { useConnectionEffects } from "./connection/useConnectionEffects";
import { useOptimisticModeToast } from "./settings/useOptimisticModeToast";
import { useGlobalLoadErrorToast } from "./useGlobalLoadErrorToast";
import { useSettingsAutoDisableToast } from "./settings/useSettingsAutoDisableToast";

const GlobalLayoutEffects = () => {
  useSlowServerToast();
  useOptimisticModeToast();
  useGlobalLoadErrorToast();
  useSettingsAutoDisableToast();

  useConnectionManager();
  useConnectionEffects();

  return null;
};

export default GlobalLayoutEffects;
