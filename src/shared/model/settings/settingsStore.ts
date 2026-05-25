import type { SettingsStore } from "./settings.types";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      isChaosMode: false,
      isOfflineMode: false,
      isBlockMutation: false,
      optimisticMode: "snapshots",

      setChaosMode: (value) =>
        set({
          isChaosMode: value,
        }),

      setOfflineMode: (value) =>
        set({
          isOfflineMode: value,
        }),

      setBlockMutation: (value) =>
        set({
          isBlockMutation: value,
        }),

      setOptimisticMode: (mode) =>
        set({
          optimisticMode: mode,
        }),

      reset: () =>
        set({
          isOfflineMode: false,
          isBlockMutation: false,
          isChaosMode: false,
          optimisticMode: "snapshots",
        }),
    }),
    {
      name: "appSettings",
    },
  ),
);

export const appSettingsSelectors = {
  settings: (state: SettingsStore) => ({
    isChaosMode: state.isChaosMode,
    isOfflineMode: state.isOfflineMode,
    isBlockMutation: state.isBlockMutation,
    optimisticMode: state.optimisticMode,
    setChaosMode: state.setChaosMode,
    setOfflineMode: state.setOfflineMode,
    setBlockMutation: state.setBlockMutation,
    setOptimisticMode: state.setOptimisticMode,
    reset: state.reset,
  }),
};

export const useSettings = () =>
  useSettingsStore(useShallow(appSettingsSelectors.settings));
