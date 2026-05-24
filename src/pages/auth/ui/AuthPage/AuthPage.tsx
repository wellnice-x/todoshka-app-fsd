import ThemeToggle from "@/shared/ui/ThemeToggle";
import PageIntro from "@/shared/ui/PageIntro";
import AuthForm from "@/features/auth";
import MoonIcon from "@/shared/assets/icons/moon.svg?react";
import SunIcon from "@/shared/assets/icons/sun.svg?react";
import styles from "./AuthPage.module.scss";
import { useAnonUser } from "@/entities/user";
import { Navigate } from "react-router";

const AuthPage = () => {
  const { hasUserName: isAuthenticated } = useAnonUser();

  if (isAuthenticated) {
    return <Navigate to="/tasks" replace />;
  }

  return (
    <>
      <PageIntro />
      <main className={`${styles.main} ${styles.appear}`}>
        <ThemeToggle
          className={styles.themeToggle}
          title="Change theme"
          lightThemeIcon={<SunIcon className={styles.themeIcon} />}
          darkThemeIcon={<MoonIcon className={styles.themeIcon} />}
        />
        <h1 className={styles.mainTitle}>Auth Page</h1>
        <section
          className={styles.authSection}
          aria-labelledby="greetings"
          role="region"
        >
          <header className={styles.header}>
            <h2 className={styles.title} id="greetings">
              Welcome to <span className={styles.appName}>ToDoSHKA</span>
            </h2>
          </header>
          <AuthForm className={styles.authForm} />
        </section>
      </main>
    </>
  );
};

export default AuthPage;
