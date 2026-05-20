import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      staleTime: 1000 * 30,
      gcTime: 1000 * 60 * 5,
    },
    mutations: {
      retry: 0,
      networkMode: "always",
    },
  },
});