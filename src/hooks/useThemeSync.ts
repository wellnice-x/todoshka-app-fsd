import { useEffect } from "react";
import { useAppearanceStore } from "@/stores/appearanceStore";

const useThemeSync = () => {
  const theme = useAppearanceStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
  }, [theme]);
};

export default useThemeSync;
