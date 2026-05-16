import "./shared/styles";
import AppRoutes from "./routes/AppRoutes";
import AppProviders from "./context/AppProviders";
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
