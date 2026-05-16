import { useIsMutating } from "@tanstack/react-query";
import type { OptimisticMode } from "@/types/optimisticMode";

const useIsMutatingByMode = (optimisticMode: OptimisticMode) => {
  const isMutating = useIsMutating({
    mutationKey: ["tasks", optimisticMode],
  });

  const isLoading = isMutating > 0;

  return isLoading;
};

export default useIsMutatingByMode;
