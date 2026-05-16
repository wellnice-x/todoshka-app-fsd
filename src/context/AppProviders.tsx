import { AuthProvider } from "./AuthProvider";
import { BrowserRouter } from "react-router";
import { PropsWithChildren } from "react";
import { useAppRuntimeStore } from "@/stores/appRuntimeStore";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/shared/lib/react-query/queryClient";
import GlobalEffects from "./GlobalEffects";

const AppProviders = ({ children }: PropsWithChildren) => {
  const sessionId = useAppRuntimeStore((state) => state.sessionId);

  return (
    <>
      <GlobalEffects />

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
