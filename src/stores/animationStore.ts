import { create } from "zustand";
import { useShallow } from "zustand/shallow";

type AnimationStore = {
  shouldTasksAnimate: boolean;
  shouldPanelAnimate: boolean;
  allowTasksAnimation: () => void;
  blockTasksAnimation: () => void;
  allowPanelAnimation: () => void;
  blockPanelAnimation: () => void;
  reset: () => void;
};

export const useAnimationStore = create<AnimationStore>((set) => ({
  shouldTasksAnimate: false,
  shouldPanelAnimate: true,

  allowTasksAnimation: () => set({ shouldTasksAnimate: true }),

  blockTasksAnimation: () => set({ shouldTasksAnimate: false }),

  allowPanelAnimation: () => set({ shouldPanelAnimate: true }),

  blockPanelAnimation: () => set({ shouldPanelAnimate: false }),

  reset: () => set({ shouldTasksAnimate: false, shouldPanelAnimate: true }),
}));

const animationSelectors = {
  animation: (state: AnimationStore) => ({
    shouldTasksAnimate: state.shouldTasksAnimate,
    shouldPanelAnimate: state.shouldPanelAnimate,
    allowTasksAnimation: state.allowTasksAnimation,
    blockTasksAnimation: state.blockTasksAnimation,
    allowPanelAnimation: state.allowPanelAnimation,
    blockPanelAnimation: state.blockPanelAnimation,
    reset: state.reset,
  }),
};

export const useAnimation = () =>
  useAnimationStore(useShallow(animationSelectors.animation));
