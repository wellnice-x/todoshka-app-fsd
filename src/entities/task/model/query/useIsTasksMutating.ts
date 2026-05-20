import { useIsMutating } from "@tanstack/react-query";
import type { OptimisticMode } from "@/shared/types/optimisticMode";

export const useIsTasksMutating = (optimisticMode: OptimisticMode) => {
  const isMutating = useIsMutating({
    mutationKey: ["tasks", optimisticMode],
  });

  const isLoading = isMutating > 0;

  return isLoading;
};