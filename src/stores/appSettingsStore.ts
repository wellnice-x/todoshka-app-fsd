import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { useAppRuntimeStore } from "./appRuntimeStore";
import type { OptimisticMode } from "@/types/optimisticMode";

type ActionResult = {
  ok: boolean;
  reason?: string;
};

type AppSettingsStore = {
  isChaosMode: boolean;
  isOfflineMode: boolean;
  isBlockMutation: boolean;
  optimisticMode: OptimisticMode;
  toggleBlockMutation: (canAccessServer: boolean) => ActionResult;
  toggleOfflineMode: (canAccessServer: boolean) => ActionResult;
  toggleChaosMode: (canAccessServer: boolean) => ActionResult;
  setOptimisticMode: (mode: OptimisticMode) => void;
  reset: () => void;
};

export const useAppSettingsStore = create<AppSettingsStore>()(
  persist(
    (set, get) => ({
      isChaosMode: false,
      isOfflineMode: false,
      isBlockMutation: false,
      optimisticMode: "snapshots",

      toggleOfflineMode: (canAccessServer) => {
        const { optimisticMode, isOfflineMode } = get();

        if (optimisticMode === "none")
          return {
            ok: false,
            reason: "This function doesn't work in non-optimistic mode",
          };

        if (
          !canAccessServer &&
          !isOfflineMode &&
          !useAppRuntimeStore.getState().isNoInternetConnection
        ) {
          return { ok: false, reason: "Already offline. No server connection" };
        }

        const nextValue = !isOfflineMode;

        if (nextValue) {
          set({
            isOfflineMode: true,
            isBlockMutation: false,
            isChaosMode: false,
          });
        } else {
          set({ isOfflineMode: false });
        }

        return { ok: true };
      },

      toggleBlockMutation: (canAccessServer) => {
        const { optimisticMode, isBlockMutation } = get();

        if (optimisticMode === "none")
          return {
            ok: false,
            reason: "This function doesn't work in non-optimistic mode",
          };

        if (!canAccessServer && !isBlockMutation) {
          return { ok: false, reason: "Requires server connection" };
        }

        const nextValue = !isBlockMutation;

        if (nextValue) {
          set({
            isBlockMutation: true,
            isOfflineMode: false,
            isChaosMode: false,
          });
        } else {
          set({ isBlockMutation: false });
        }

        return { ok: true };
      },

      toggleChaosMode: (canAccessServer) => {
        const { isChaosMode } = get();

        if (!canAccessServer && !isChaosMode) {
          return { ok: false, reason: "Requires server connection" };
        }

        const nextValue = !isChaosMode;

        if (nextValue) {
          set({
            isChaosMode: true,
            isOfflineMode: false,
            isBlockMutation: false,
          });
        } else {
          set({ isChaosMode: false });
        }

        return { ok: true };
      },

      setOptimisticMode: (mode) => {
        const { isOfflineMode, isBlockMutation } = get();

        if (mode === "none" && (isOfflineMode || isBlockMutation)) {
          set({
            optimisticMode: mode,
            isOfflineMode: false,
            isBlockMutation: false,
          });

          useAppRuntimeStore.getState().markSettingsDisabled();

          return;
        }

        set({ optimisticMode: mode });

        useAppRuntimeStore.getState().unmarkSettingsDisabled();
      },

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
  settings: (state: AppSettingsStore) => ({
    isChaosMode: state.isChaosMode,
    isOfflineMode: state.isOfflineMode,
    isBlockMutation: state.isBlockMutation,
    optimisticMode: state.optimisticMode,
    toggleChaosMode: state.toggleChaosMode,
    toggleOfflineMode: state.toggleOfflineMode,
    toggleBlockMutation: state.toggleBlockMutation,
    setOptimisticMode: state.setOptimisticMode,
    reset: state.reset,
  }),
};

export const useAppSettings = () =>
  useAppSettingsStore(useShallow(appSettingsSelectors.settings));
