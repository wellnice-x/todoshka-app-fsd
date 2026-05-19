import { create } from "zustand";
import { useShallow } from "zustand/shallow";

type RuntimeStore = {
  sessionId: string;
  settingsAutoDisabled: boolean;
  isNoInternetConnection: boolean;
  setIsNoInternetConnection: (value: boolean) => void;
  markSettingsDisabled: () => void;
  unmarkSettingsDisabled: () => void;
  resetSession: () => void;
};

export const useRuntimeStore = create<RuntimeStore>((set) => ({
  sessionId: crypto.randomUUID(),
  settingsAutoDisabled: false,
  isNoInternetConnection: false,

  setIsNoInternetConnection: (value) => set({ isNoInternetConnection: value }),

  markSettingsDisabled: () => set({ settingsAutoDisabled: true }),

  unmarkSettingsDisabled: () => set({ settingsAutoDisabled: false }),

  resetSession: () =>
    set({
      sessionId: crypto.randomUUID(),
    }),
}));

export const runtimeSelectors = {
  runtime: (state: RuntimeStore) => ({
    sessionId: state.sessionId,
    settingsAutoDisabled: state.settingsAutoDisabled,
    isNoInternetConnection: state.isNoInternetConnection,
    setIsNoInternetConnection: state.setIsNoInternetConnection,
    markSettingsDisabled: state.markSettingsDisabled,
    unmarkSettingsDisabled: state.unmarkSettingsDisabled,
    resetSession: state.resetSession,
  }),
};

export const useRuntime = () =>
  useRuntimeStore(useShallow(runtimeSelectors.runtime));
