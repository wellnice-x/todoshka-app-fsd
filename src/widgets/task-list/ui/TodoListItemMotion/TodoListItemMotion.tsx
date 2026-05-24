import type { ReactNode } from "react";
import styles from "./TodoListItemMotion.module.scss";
import { useAnimation } from "@/shared/lib/animation/animationStore";
import { useSettingsStore } from "@/shared/model/settings";
import { motion, type Target } from "motion/react";

type MotionListItemProps = {
  children: ReactNode;
  className?: string;
};

const isAddAnimation = (target: Target) =>
  target?.x === 0 && target?.opacity === 1;

const isExitAnimation = (target: Target) => target?.x === -300;

const TodoListItemMotion = ({ children, className }: MotionListItemProps) => {
  const { shouldTasksAnimate, blockTasksAnimation } = useAnimation();

  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  return (
    <motion.li
      className={`
        ${styles.motionItem} 
        ${className ?? ""}
      `}
      initial={shouldTasksAnimate ? { opacity: 0, x: 300, height: 0 } : false}
      animate={{ opacity: 1, x: 0, height: "auto" }}
      exit={shouldTasksAnimate ? { opacity: 0, x: -300, height: 0 } : undefined}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.4 }}
      layout={false}
      onAnimationStart={(def: Target) => {
        if (
          (isAddAnimation(def) || isExitAnimation(def)) &&
          optimisticMode !== "none"
        ) {
          blockTasksAnimation();
        }
      }}
    >
      {children}
    </motion.li>
  );
};

export default TodoListItemMotion;
