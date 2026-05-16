import GlobalLayoutEffects from "./context/GlobalLayoutEffects";
import useKeyboardFocus from "./hooks/useKeyboardFocus";
import lightBackground from "@/assets/images/bg-decor.webp";
import ThemeBackground from "./components/ThemeBackground";
import darkBackground from "@/assets/images/bg-decor-alt.webp";
import Header from "./components/Header";
import Footer from "./components/Footer";
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
