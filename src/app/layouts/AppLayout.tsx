import GlobalLayoutEffects from "../effects/GlobalLayoutEffects";
import Header from "@/widgets/header";
import Footer from "@/widgets/footer";
import { TasksStrategyProvider } from "@/features/tasks-management";
import lightBackground from "@/shared/assets/images/bg-decor.webp";
import darkBackground from "@/shared/assets/images/bg-decor-alt.webp";
import ThemeBackground from "@/shared/ui/ThemeBackground";
import { useKeyboardFocus } from "@/shared/lib/accessibility";
import { useRuntimeStore } from "@/shared/model";
import { Outlet } from "react-router";

function AppLayout() {
  const isTestMode = useRuntimeStore((state) => state.isTestMode);

  useKeyboardFocus();

  return (
    <>
      {!isTestMode && <GlobalLayoutEffects />}

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
