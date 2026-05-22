import type { UITask } from "@/entities/task";
import { useEffect } from "react";
import { useUIKeyStore } from "@/entities/task";
import { useTasksQueryState } from "@/features/tasks-management/model/query/useTasksQueryState";
import { useTasksSnapshotsRuntime } from "@/features/tasks-management/model/strategies/snapshots/runtime/useTasksSnapshotsRuntime";
import { useSnapshotFallbackEffect } from "@/features/tasks-management/model/strategies/snapshots/effects/useSnapshotFallbackEffect";
import { useSnapshotRecoveryEffect } from "@/features/tasks-management/model/strategies/snapshots/effects/useSnapshotRecoveryEffect";

export const useInitSnapshotStrategy = (uiTasks: UITask[]) => {
  const runtime = useTasksSnapshotsRuntime();

  const { optimisticMode, scheduleQuerySync } = runtime;

  const { cleanupUIKeys } = useUIKeyStore.getState();

  const { isLoading } = useTasksQueryState();

  useSnapshotFallbackEffect(runtime, isLoading);
  useSnapshotRecoveryEffect(runtime);

  useEffect(() => {
    if (optimisticMode !== "snapshots") return;

    scheduleQuerySync(0);
  }, [scheduleQuerySync, optimisticMode]);

  useEffect(() => {
    if (optimisticMode !== "snapshots") return;

    cleanupUIKeys(uiTasks.map((task) => task.id));
  }, [uiTasks, cleanupUIKeys, optimisticMode]);
};
