import styles from "./Dropdown.module.scss";
import { useState, useRef, useEffect, ReactNode, useId } from "react";

type DropdownProps = {
  className?: string;
  buttonTitle?: string;
  menuTitle?: string;
  buttonIcon?: ReactNode;
  children?: ReactNode;
  menuSide?: "left" | "right";
};

const Dropdown = (props: DropdownProps) => {
  const {
    className,
    buttonTitle,
    menuTitle,
    buttonIcon,
    children,
    menuSide = "left",
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const menuId = useId();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        close();
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <div className={`${styles.dropdown} ${className ?? ""}`}>
      <button
        className={styles.button}
        type="button"
        title={buttonTitle}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={menuId}
        ref={buttonRef}
      >
        {buttonIcon}
      </button>
      <div
        className={`
          ${styles.menu} 
          ${isOpen ? styles.open : ""}
          ${menuSide === "right" ? styles.rightSide : ""}
        `}
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-hidden={!isOpen}
      >
        <span className={styles.menuInfo}>{menuTitle}</span>
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
