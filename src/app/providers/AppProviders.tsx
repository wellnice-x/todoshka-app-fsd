import GlobalAppEffects from "../effects/GlobalAppEffects";
import { queryClient } from "@/shared/lib/react-query";
import { AuthProvider } from "@/shared/auth";
import { useRuntimeStore } from "@/shared/model";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";

const AppProviders = ({ children }: PropsWithChildren) => {
  const sessionId = useRuntimeStore((state) => state.sessionId);

  return (
    <>
      <GlobalAppEffects />

      <Toaster
        position="bottom-left"
        toastOptions={{ style: { maxWidth: "370px" } }}
      />

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
