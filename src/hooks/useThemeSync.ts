import { useEffect } from "react";
import { useAppearanceStore } from "@/app/model/appearanceStore";

const useThemeSync = () => {
  const theme = useAppearanceStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", theme === "dark");
  }, [theme]);
};

export default useThemeSync;
