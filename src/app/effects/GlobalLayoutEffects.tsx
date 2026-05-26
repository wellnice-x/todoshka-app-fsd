import { useSlowServerToast } from "@/shared/lib/react-query";
import { useConnectionManager } from "@/shared/api";
import { useConnectionEffects } from "@/shared/api";
import {
  useOptimisticModeToast,
  useSettingsAutoDisableToast,
} from "@/shared/model";
import { useGlobalLoadErrorToast } from "./useGlobalLoadErrorToast";

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
