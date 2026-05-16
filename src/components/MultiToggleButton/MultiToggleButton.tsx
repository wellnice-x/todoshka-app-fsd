import styles from "./MultiToggleButton.module.scss";
import { motion } from "motion/react";

type LabelPosition = "left" | "top";

type Option<T extends string | number> = {
  label: string;
  value: T;
};

type MultiToggleButtonProps<T extends string | number> = {
  className?: string;
  label?: string;
  labelPosition?: LabelPosition;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

const MultiToggleButton = <T extends string | number>({
  className,
  label,
  labelPosition = "left",
  options,
  value,
  onChange,
}: MultiToggleButtonProps<T>) => {
  return (
    <div
      className={`${styles.wrapper} ${
        labelPosition === "top"
          ? styles.verticalLabelPosition
          : styles.horizontalLabelPosition
      } ${className ?? ""}`}
    >
      {label && <span className={styles.label}>{label}</span>}

      <div className={styles.switcher}>
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              className={`${styles.option} ${
                isActive ? styles.activeOption : ""
              }`}
              onClick={() => onChange(option.value)}
              type="button"
            >
              {isActive && (
                <motion.div
                  className={styles.thumb}
                  layoutId="thumb"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              <span className={styles.labelText}>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultiToggleButton;
