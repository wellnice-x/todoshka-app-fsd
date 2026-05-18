import { create } from "zustand";

type GlobalErrorStore = {
  loadErrorShown: boolean;
  setLoadErrorShown: (value: boolean) => void;
  reset: () => void;
};

export const useGlobalErrorStore = create<GlobalErrorStore>((set) => ({
  loadErrorShown: false,
  setLoadErrorShown: (value) => set({ loadErrorShown: value }),
  reset: () => set({ loadErrorShown: false }),
}));
