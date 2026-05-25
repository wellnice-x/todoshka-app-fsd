import GlobalAppEffects from "../effects/GlobalAppEffects";
import { queryClient } from "@/shared/lib/react-query";
import { AuthProvider } from "@/shared/auth";
import { useRuntimeStore } from "@/shared/model";
import { BrowserRouter } from "react-router";
import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

const AppProviders = ({ children }: PropsWithChildren) => {
  const sessionId = useRuntimeStore((state) => state.sessionId);

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
