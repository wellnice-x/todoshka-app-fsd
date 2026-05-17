import { AuthProvider } from "./with-auth/AuthProvider";
import { BrowserRouter } from "react-router";
import { PropsWithChildren } from "react";
import { useAppRuntimeStore } from "@/stores/appRuntimeStore";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/shared/lib/react-query/queryClient";
import GlobalAppEffects from "../effects/GlobalAppEffects";

const AppProviders = ({ children }: PropsWithChildren) => {
  const sessionId = useAppRuntimeStore((state) => state.sessionId);

  return (
    <>
      <GlobalAppEffects />

      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider key={sessionId} client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default AppProviders;
