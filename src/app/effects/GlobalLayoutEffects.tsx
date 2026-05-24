import { useSlowServerToast } from "@/shared/lib/react-query";
import { useConnectionManager } from "@/shared/api/network";
import { useAuthCheckingToast } from "@/shared/auth";
import { useConnectionEffects } from "@/shared/api/network";
import { useGlobalLoadErrorToast } from "./useGlobalLoadErrorToast";
import {
  useOptimisticModeToast,
  useSettingsAutoDisableToast,
} from "@/shared/model/settings";

const GlobalLayoutEffects = () => {
  useSlowServerToast();
  useAuthCheckingToast();
  useOptimisticModeToast();
  useGlobalLoadErrorToast();
  useSettingsAutoDisableToast();

  useConnectionManager();
  useConnectionEffects();

  return null;
};

export default GlobalLayoutEffects;
