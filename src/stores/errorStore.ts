import { create } from "zustand";

type ErrorStore = {
  loadErrorShown: boolean;
  setLoadErrorShown: (value: boolean) => void;
  reset: () => void;
};

export const useErrorStore = create<ErrorStore>((set) => ({
  loadErrorShown: false,
  setLoadErrorShown: (value) => set({ loadErrorShown: value }),
  reset: () => set({ loadErrorShown: false }),
}));
