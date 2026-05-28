import type { OptimisticMode } from "@/shared/optimistic-mode";
import type { ActionResult } from "./settings.types";

import { useSettingsStore } from "./settingsStore";
import { useRuntimeStore } from "../runtime";

export const settingsUseCases = {
  toggleOfflineMode(canAccessServer: boolean): ActionResult {
    const settings = useSettingsStore.getState();

    const {
      optimisticMode,
      isOfflineMode,
      setOfflineMode,
      setBlockMutation,
      setChaosMode,
    } = settings;

    if (optimisticMode === "none") {
      return {
        ok: false,
        reason: "This function doesn't work in non-optimistic mode",
      };
    }

    if (
      !canAccessServer &&
      !isOfflineMode &&
      !useRuntimeStore.getState().isNoInternetConnection
    ) {
      return {
        ok: false,
        reason: "Already offline. No server connection",
      };
    }

    const nextValue = !isOfflineMode;

    if (nextValue) {
      setOfflineMode(true);
      setBlockMutation(false);
      setChaosMode(false);
    } else {
      setOfflineMode(false);
    }

    return { ok: true, enabled: nextValue };
  },

  toggleBlockMutation(canAccessServer: boolean): ActionResult {
    const settings = useSettingsStore.getState();

    const {
      optimisticMode,
      isBlockMutation,
      setBlockMutation,
      setOfflineMode,
      setChaosMode,
    } = settings;

    if (optimisticMode === "none") {
      return {
        ok: false,
        reason: "This function doesn't work in non-optimistic mode",
      };
    }

    if (!canAccessServer && !isBlockMutation) {
      return {
        ok: false,
        reason: "Requires server connection",
      };
    }

    const nextValue = !isBlockMutation;

    if (nextValue) {
      setBlockMutation(true);
      setOfflineMode(false);
      setChaosMode(false);
    } else {
      setBlockMutation(false);
    }

    return { ok: true, enabled: nextValue };
  },

  toggleChaosMode(canAccessServer: boolean): ActionResult {
    const settings = useSettingsStore.getState();

    const { isChaosMode, setChaosMode, setOfflineMode, setBlockMutation } =
      settings;

    if (!canAccessServer && !isChaosMode) {
      return {
        ok: false,
        reason: "Requires server connection",
      };
    }

    const nextValue = !isChaosMode;

    if (nextValue) {
      setChaosMode(true);
      setOfflineMode(false);
      setBlockMutation(false);
    } else {
      setChaosMode(false);
    }

    return { ok: true, enabled: nextValue };
  },

  changeOptimisticMode(mode: OptimisticMode) {
    const settings = useSettingsStore.getState();

    const {
      isOfflineMode,
      isBlockMutation,
      setOptimisticMode,
      setOfflineMode,
      setBlockMutation,
    } = settings;

    if (mode === "none" && (isOfflineMode || isBlockMutation)) {
      setOptimisticMode(mode);

      setOfflineMode(false);
      setBlockMutation(false);

      useRuntimeStore.getState().markSettingsDisabled();

      return;
    }

    setOptimisticMode(mode);

    useRuntimeStore.getState().unmarkSettingsDisabled();
  },
};
