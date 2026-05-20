import "./styles";
import AppRoutes from "./router/AppRoutes";
import AppProviders from "./providers/AppProviders";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <AppProviders>
    <AppRoutes />
  </AppProviders>,
);
