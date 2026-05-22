import { useEffect } from "react";
import { fallbackTasks } from "@/entities/task";
import type { TasksSnapshotsRuntime } from "../types";

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
