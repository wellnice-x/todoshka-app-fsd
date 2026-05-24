import styles from "./Header.module.scss";
import SunIcon from "@/shared/assets/icons/sun.svg?react";
import MoonIcon from "@/shared/assets/icons/moon.svg?react";
import ThemeToggle from "@/shared/ui/ThemeToggle";
import ParallaxToggle from "@/shared/ui/ParallaxToggle";
import ParallaxOnIcon from "@/shared/assets/icons/parallax-on-icon.svg?react";
import ParallaxOffIcon from "@/shared/assets/icons/parallax-off-icon.svg?react";
import DeleteAccountButton from "@/features/delete-account";
import DeveloperSettingsMenu from "@/features/developer-settings";
import { useAnonUser } from "@/entities/user";

type HeaderProps = {
  className?: string;
};

const Header = ({ className }: HeaderProps) => {
  const { userNickname } = useAnonUser();

  return (
    <header className={`${styles.header} ${className ?? ""}`}>
      <img
        className={styles.logo}
        src="/logo.png"
        alt="logo"
        width={120}
        height={120}
      />
      <div className={styles.actionsWrapper}>
        <div className={styles.accountActions}>
          <h2 className={styles.userName}>{userNickname}</h2>
          <DeleteAccountButton />
        </div>
        <div className={styles.appActions}>
          <ParallaxToggle
            title="Toggle parallax"
            enabledParallaxIcon={<ParallaxOnIcon />}
            disabledParallaxIcon={<ParallaxOffIcon />}
          />
          <ThemeToggle
            title="Change theme"
            lightThemeIcon={<SunIcon />}
            darkThemeIcon={<MoonIcon />}
          />
          <DeveloperSettingsMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
