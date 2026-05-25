import GlobalLayoutEffects from "../effects/GlobalLayoutEffects";
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import { TasksStrategyProvider } from "@/features/tasks-management";
import lightBackground from "@/shared/assets/images/bg-decor.webp";
import darkBackground from "@/shared/assets/images/bg-decor-alt.webp";
import ThemeBackground from "@/shared/ui/ThemeBackground";
import { useKeyboardFocus } from "@/shared/lib/accessibility";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";

function AppLayout() {
  useKeyboardFocus();

  return (
    <>
      <GlobalLayoutEffects />

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
        <Outlet />
      </TasksStrategyProvider>

      <Footer />
    </>
  );
}

export default AppLayout;
