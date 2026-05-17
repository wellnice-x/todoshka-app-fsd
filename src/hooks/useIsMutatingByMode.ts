import { useIsMutating } from "@tanstack/react-query";
import type { OptimisticMode } from "@/features/change-optimistic-mode";

const useIsMutatingByMode = (optimisticMode: OptimisticMode) => {
  const isMutating = useIsMutating({
    mutationKey: ["tasks", optimisticMode],
  });

  const isLoading = isMutating > 0;

  return isLoading;
};

export default useIsMutatingByMode;
