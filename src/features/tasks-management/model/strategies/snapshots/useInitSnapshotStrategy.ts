import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { tasksUseCases } from "@/entities/task";
import { useSnapshotFallbackEffect } from "./effects/useSnapshotFallbackEffect";
import { useSnapshotRecoveryEffect } from "./effects/useSnapshotRecoveryEffect";
import { useTasksSnapshotsRuntime } from "./runtime/useTasksSnapshotsRuntime";

const useInitSnapshotStrategy = () => {
  const runtime = useTasksSnapshotsRuntime();

  const { optimisticMode, isServerAccessBlocked, scheduleQuerySync } = runtime;

  const { isLoading } = useQuery({
    queryKey: ["tasks", optimisticMode],
    queryFn: tasksUseCases.getAll,
    enabled: optimisticMode === "snapshots" && !isServerAccessBlocked,
  });

  useSnapshotFallbackEffect(runtime, isLoading);
  useSnapshotRecoveryEffect(runtime);

  useEffect(() => {
    if (optimisticMode !== "snapshots") return;

    scheduleQuerySync(0);
  }, [scheduleQuerySync, optimisticMode]);
};

export default useInitSnapshotStrategy;
