import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { tasksUseCases } from "@/entities/task";
import { useInitPatchesCache } from "./useInitPatchesCache";
import { useTasksPatchRuntime } from "./runtime/useTasksPatchRuntime";
import { usePatchFallbackEffect } from "./effects/usePatchFallbackEffect";
import { usePatchRecoveryEffect } from "./effects/usePatchRecoveryEffect";

const useInitPatchStrategy = () => {
  const runtime = useTasksPatchRuntime();

  const { optimisticMode, isServerAccessBlocked, scheduleQuerySync } = runtime;

  const { isLoading } = useQuery({
    queryKey: ["tasks", optimisticMode],
    queryFn: tasksUseCases.getAll,
    enabled: optimisticMode === "patches" && !isServerAccessBlocked,
  });

  useInitPatchesCache();

  usePatchFallbackEffect(runtime, isLoading);
  usePatchRecoveryEffect(runtime);
  useEffect(() => {
    if (optimisticMode !== "patches") return;

    scheduleQuerySync(0);
  }, [optimisticMode, scheduleQuerySync]);
};

export default useInitPatchStrategy;
