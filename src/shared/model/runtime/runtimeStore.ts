import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

type RuntimeStore = {
  sessionId: string;
  settingsAutoDisabled: boolean;
  isTestMode: boolean;
  isNoInternetConnection: boolean;
  setIsNoInternetConnection: (value: boolean) => void;
  setIsTestMode: (value: boolean) => void;
  markSettingsDisabled: () => void;
  unmarkSettingsDisabled: () => void;
  resetSession: () => void;
};

export const useRuntimeStore = create<RuntimeStore>()(
  persist(
    (set) => ({
      sessionId: crypto.randomUUID(),
      settingsAutoDisabled: false,
      isNoInternetConnection: false,
      isTestMode: false,

      setIsNoInternetConnection: (value) =>
        set({ isNoInternetConnection: value }),

      setIsTestMode: (value) => set({ isTestMode: value }),

      markSettingsDisabled: () => set({ settingsAutoDisabled: true }),

      unmarkSettingsDisabled: () => set({ settingsAutoDisabled: false }),

      resetSession: () =>
        set({
          sessionId: crypto.randomUUID(),
          isTestMode: false,
        }),
    }),
    {
      name: "appRuntime",

      partialize: (state) => ({
        isTestMode: state.isTestMode,
      }),
    },
  ),
);

export const runtimeSelectors = {
  runtime: (state: RuntimeStore) => ({
    sessionId: state.sessionId,
    settingsAutoDisabled: state.settingsAutoDisabled,
    isTestMode: state.isTestMode,
    isNoInternetConnection: state.isNoInternetConnection,
    setIsTestMode: state.setIsTestMode,
    setIsNoInternetConnection: state.setIsNoInternetConnection,
    markSettingsDisabled: state.markSettingsDisabled,
    unmarkSettingsDisabled: state.unmarkSettingsDisabled,
    resetSession: state.resetSession,
  }),
};

export const useRuntime = () =>
  useRuntimeStore(useShallow(runtimeSelectors.runtime));
