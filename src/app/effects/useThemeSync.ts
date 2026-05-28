import { useAppearanceStore } from "@/shared/model";
import { useEffect } from "react";

export const useThemeSync = () => {
  const theme = useAppearanceStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
  }, [theme]);
};
