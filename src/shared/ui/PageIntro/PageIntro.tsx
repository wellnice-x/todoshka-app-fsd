import { motion } from "motion/react";
import styles from "./PageIntro.module.scss";

const PageIntro = ({ onFinish }: { onFinish?: () => void }) => {
  return (
    <motion.div
      className={styles.overlay}
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      style={{ transformOrigin: "top" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onFinish}
    >
      <div className={styles.scanLine} />
    </motion.div>
  );
};

export default PageIntro;
