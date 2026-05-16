import { create } from "zustand";
import { useShallow } from "zustand/shallow";

type AppRuntimeStore = {
  sessionId: string;
  settingsAutoDisabled: boolean;
  isNoInternetConnection: boolean;
  setIsNoInternetConnection: (value: boolean) => void;
  markSettingsDisabled: () => void;
  unmarkSettingsDisabled: () => void;
  resetSession: () => void;
};

export const useAppRuntimeStore = create<AppRuntimeStore>((set) => ({
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

export const appRuntimeSelectors = {
  runtime: (state: AppRuntimeStore) => ({
    sessionId: state.sessionId,
    settingsAutoDisabled: state.settingsAutoDisabled,
    isNoInternetConnection: state.isNoInternetConnection,
    setIsNoInternetConnection: state.setIsNoInternetConnection,
    markSettingsDisabled: state.markSettingsDisabled,
    unmarkSettingsDisabled: state.unmarkSettingsDisabled,
    resetSession: state.resetSession,
  }),
};

export const useAppRuntime = () =>
  useAppRuntimeStore(useShallow(appRuntimeSelectors.runtime));
