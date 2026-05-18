import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isMobileDevice } from "@/shared/lib/device/isMobileDevice";

type Theme = "light" | "dark";

type AppearanceStore = {
  theme: Theme;
  isParallax: boolean;
  isFooterCollapsed: boolean;
  toggleTheme: () => void;
  toggleParallax: () => void;
  toggleFooterCollapsed: () => void;
  setFooterCollapsed: (value: boolean) => void;
  reset: () => void;
};

export const useAppearanceStore = create<AppearanceStore>()(
  persist(
    (set) => ({
      theme: "dark",
      isParallax: !isMobileDevice(),
      isFooterCollapsed: false,

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      toggleParallax: () =>
        set((state) => ({
          isParallax: !state.isParallax,
        })),

      toggleFooterCollapsed: () =>
        set((state) => ({
          isFooterCollapsed: !state.isFooterCollapsed,
        })),

      setFooterCollapsed: (value) => set({ isFooterCollapsed: value }),

      reset: () =>
        set({
          theme: "dark",
          isParallax: !isMobileDevice(),
          isFooterCollapsed: false,
        }),
    }),
    {
      name: "appearance",
    },
  ),
);
