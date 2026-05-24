import { useEffect } from "react";
import { useAppearanceStore } from "../appearanceStore";

export const useThemeSync = () => {
  const theme = useAppearanceStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
  }, [theme]);
};
