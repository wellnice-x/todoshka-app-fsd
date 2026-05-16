import useIsMobile from "@/hooks/useIsMobile";
import styles from "./ThemeBackground.module.scss";
import { useEffect, useRef } from "react";
import { useAppearanceStore } from "@/stores/appearanceStore";

type ThemeBackgroundProps = {
  isAltPosition?: boolean;
  isBlurred?: boolean;
  lightThemeImageSrc: string;
  darkThemeImageSrc: string;
};

const ThemeBackground = (props: ThemeBackgroundProps) => {
  const {
    isAltPosition = false,
    isBlurred = false,
    lightThemeImageSrc,
    darkThemeImageSrc,
  } = props;

  const isMobile = useIsMobile();

  const isParallax = useAppearanceStore((state) => state.isParallax);
  const theme = useAppearanceStore((state) => state.theme);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobile || !isParallax) return;

    const element = containerRef.current;

    if (!element) return;

    let rafId: number;

    let currentX = 0;
    let currentY = 0;

    let targetX = 0;
    let targetY = 0;

    const strength = 2;

    const animate = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      element.style.transform = `translate(${currentX * strength}px, ${currentY * strength}px)`;

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      targetX = (event.clientX / innerWidth - 0.5) * 2;
      targetY = (event.clientY / innerHeight - 0.5) * 2;
    };

    rafId = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile, isParallax]);

  return (
    <div
      className={`${styles.wrapper} ${isAltPosition ? styles.altPosition : ""}`}
    >
      <div
        className={`${styles.inner} ${isBlurred ? styles.blurred : ""}`}
        ref={containerRef}
      >
        <img
          className={`
            ${styles.image} 
            ${styles.light}
            ${theme === "light" ? styles.isCurrent : ""} 
          `}
          src={lightThemeImageSrc}
          alt="light theme background image"
          aria-hidden
        />
        <img
          className={`
            ${styles.image} 
            ${styles.dark}
            ${theme === "dark" ? styles.isCurrent : ""} 
          `}
          src={darkThemeImageSrc}
          alt="dark theme background image"
          aria-hidden
        />
      </div>
    </div>
  );
};

export default ThemeBackground;
