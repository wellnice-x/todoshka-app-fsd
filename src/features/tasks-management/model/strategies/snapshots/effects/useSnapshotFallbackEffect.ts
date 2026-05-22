import type { TasksSnapshotsRuntime } from "@/features/tasks-management/model/strategies/snapshots/types";
import { useEffect } from "react";
import { fallbackTasks } from "@/entities/task";

export const useSnapshotFallbackEffect = (
  runtime: TasksSnapshotsRuntime,
  isLoading: boolean,
) => {
  const {
    optimisticMode,
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
  } = runtime;

  useEffect(() => {
    if (optimisticMode !== "snapshots") return;

    if (isServerAccessUncertain) return;

    const existing = queryClient.getQueryData(["tasks", optimisticMode]);

    if (!existing && isServerAccessBlocked && !isLoading) {
      queryClient.setQueryData(["tasks", optimisticMode], fallbackTasks());
    }
  }, [
    optimisticMode,
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    isLoading,
  ]);
};
