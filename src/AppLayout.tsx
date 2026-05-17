import GlobalLayoutEffects from "./context/GlobalLayoutEffects";
import useKeyboardFocus from "./hooks/useKeyboardFocus";
import lightBackground from "@/shared/assets/images/bg-decor.webp";
import ThemeBackground from "./widgets/theme-background/ui/ThemeBackground";
import darkBackground from "@/shared/assets/images/bg-decor-alt.webp";
import Header from "./widgets/header";
import Footer from "./widgets/footer";
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
      <Outlet />
      <Footer />
    </>
  );
}

export default AppLayout;
