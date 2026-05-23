import GlobalLayoutEffects from "@/app/effects/GlobalLayoutEffects";
import useKeyboardFocus from "@/shared/lib/accessibility/useKeyboardFocus";
import lightBackground from "@/shared/assets/images/bg-decor.webp";
import ThemeBackground from "@/shared/ui/ThemeBackground";
import darkBackground from "@/shared/assets/images/bg-decor-alt.webp";
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import { TasksStrategyProvider } from "@/features/tasks-management";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

function AppLayout() {
  useKeyboardFocus();

  return (
    <>
      <Toaster
        position="bottom-left"
        toastOptions={{ style: { maxWidth: "370px" } }}
      />

      <ThemeBackground
        lightThemeImageSrc={lightBackground}
        darkThemeImageSrc={darkBackground}
      />

      <Header />
      <TasksStrategyProvider>
        <GlobalLayoutEffects />

        <Outlet />
      </TasksStrategyProvider>
      <Footer />
    </>
  );
}

export default AppLayout;
