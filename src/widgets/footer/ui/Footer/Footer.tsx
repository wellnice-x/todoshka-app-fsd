import styles from "./Footer.module.scss";
import FilledCircle from "@/shared/assets/icons/filled-circle.svg?react";
import { useAppearanceStore } from "@/app/model/appearanceStore";
import { useConnectionStore } from "@/shared/api/network/model/connectionStore";

type FooterProps = {
  className?: string;
};

const Footer = ({ className }: FooterProps) => {
  const connectionStatus = useConnectionStore(
    (state) => state.connectionStatus,
  );
  const isCollapsed = useAppearanceStore((state) => state.isFooterCollapsed);
  const toggleFooterCollapsed = useAppearanceStore(
    (state) => state.toggleFooterCollapsed,
  );

  return (
    <footer
      className={`
        ${styles.footer}
        ${isCollapsed ? styles.footerCollapsed : ""}
        ${className ?? ""}
      `}
      onClick={toggleFooterCollapsed}
      aria-label={isCollapsed ? "Expand footer" : "Collapse footer"}
    >
      {!isCollapsed && <span className={styles.info}>Connection</span>}

      <FilledCircle
        className={`
          ${styles.filledCircle}
          ${styles[connectionStatus]}
        `}
      />
    </footer>
  );
};

export default Footer;
