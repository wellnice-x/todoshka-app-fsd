import { AuthProvider } from "./with-auth/AuthProvider";
import { BrowserRouter } from "react-router";
import { useRuntimeStore } from "@/app/model";
import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/shared/lib/react-query/queryClient";
import GlobalAppEffects from "@/app/effects/GlobalAppEffects";

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
