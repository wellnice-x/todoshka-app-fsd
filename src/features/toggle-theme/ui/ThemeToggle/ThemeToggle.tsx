import { useAppearanceStore } from "@/stores/appearanceStore";
import { ReactNode } from "react";
import styles from "./ThemeToggle.module.scss";

type ThemeToggleProps = {
  className?: string;
  title?: string;
  lightThemeIcon: ReactNode;
  darkThemeIcon: ReactNode;
};

const ThemeToggle = (props: ThemeToggleProps) => {
  const { className, title, lightThemeIcon, darkThemeIcon } = props;

  const theme = useAppearanceStore((state) => state.theme);
  const toggleTheme = useAppearanceStore((state) => state.toggleTheme);

  return (
    <button
      className={`${styles.button} ${className ?? ""}`}
      onClick={toggleTheme}
      type="button"
      title={title}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? lightThemeIcon : darkThemeIcon}
    </button>
  );
};

export default ThemeToggle;
