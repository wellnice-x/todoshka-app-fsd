import type { OptimisticMode } from "@/shared/types/optimisticMode";
import { useIsMutating } from "@tanstack/react-query";

export const useIsTasksMutating = (optimisticMode: OptimisticMode) => {
  const isMutating = useIsMutating({
    mutationKey: ["tasks", optimisticMode],
  });

  const isLoading = isMutating > 0;

  return isLoading;
};