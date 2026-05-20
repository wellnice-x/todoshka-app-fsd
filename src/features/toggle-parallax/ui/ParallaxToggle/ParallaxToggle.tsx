import { ReactNode } from "react";
import { useAppearanceStore } from "@/shared/model/appearance";
import toast from "react-hot-toast";
import styles from "./ParallaxToggle.module.scss";
import useIsMobile from "@/shared/lib/device/useIsMobile";

type ParallaxToggleProps = {
  className?: string;
  title?: string;
  enabledParallaxIcon: ReactNode;
  disabledParallaxIcon: ReactNode;
};

const ParallaxToggle = (props: ParallaxToggleProps) => {
  const { className, title, enabledParallaxIcon, disabledParallaxIcon } = props;

  const isParallax = useAppearanceStore((state) => state.isParallax);
  const toggleParallax = useAppearanceStore((state) => state.toggleParallax);

  const isMobile = useIsMobile();

  const handleToggle = () => {
    if (isMobile) {
      toast.error("Unsupported on mobile devices", {
        icon: "😕",
        id: "unsupportedOnMobileToast",
      });
    } else {
      toggleParallax();
    }
  };

  return (
    <button
      className={`${styles.button} ${className ?? ""}`}
      onClick={handleToggle}
      type="button"
      title={title}
      aria-label={`${isParallax ? "Disable" : "Enable"} parallax effect`}
    >
      {isParallax ? enabledParallaxIcon : disabledParallaxIcon}
    </button>
  );
};

export default ParallaxToggle;
