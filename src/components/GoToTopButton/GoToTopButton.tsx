import styles from "./GoToTopButton.module.scss";
import CircledArrowUpIcon from "@/shared/assets/icons/circled-arrow-up.svg?react";
import { useEffect, useState } from "react";

type GoToTopButtonProps = {
  className?: string;
};

const GoToTopButton = ({ className }: GoToTopButtonProps) => {
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsButtonVisible(window.scrollY > 700);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={`
        ${styles.button} 
        ${!isButtonVisible ? styles.hidden : ""} 
        ${className ?? ""}`}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      type="button"
      aria-label="Go to top"
    >
      <CircledArrowUpIcon className={styles.icon} aria-hidden="true" />
    </button>
  );
};

export default GoToTopButton;
