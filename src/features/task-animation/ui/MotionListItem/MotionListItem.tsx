import styles from "./MotionListItem.module.scss";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { useAnimation } from "@/shared/lib/animation/model/animationStore";
import { useAppSettingsStore } from "@/app/model/settings/appSettingsStore";

type MotionListItemProps = {
  children: ReactNode;
  className?: string;
};

type AnimationDefinition = {
  x?: number;
  opacity?: number;
  height?: number | string;
};

const isAddAnimation = (definition: AnimationDefinition) =>
  definition?.x === 0 && definition?.opacity === 1;

const isExitAnimation = (definition: AnimationDefinition) =>
  definition?.x === -300;

const MotionListItem = ({ children, className }: MotionListItemProps) => {
  const { shouldTasksAnimate, blockTasksAnimation } = useAnimation();
  const optimisticMode = useAppSettingsStore((state) => state.optimisticMode);

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
      onAnimationStart={(def: AnimationDefinition) => {
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

export default MotionListItem;
