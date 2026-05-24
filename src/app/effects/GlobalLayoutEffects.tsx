import { useSlowServerToast } from "@/shared/lib/react-query";
import { useConnectionManager } from "@/shared/api";
import { useAuthCheckingToast } from "@/shared/auth";
import { useConnectionEffects } from "@/shared/api";
import { useGlobalLoadErrorToast } from "./useGlobalLoadErrorToast";
import {
  useOptimisticModeToast,
  useSettingsAutoDisableToast,
} from "@/shared/model";

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
