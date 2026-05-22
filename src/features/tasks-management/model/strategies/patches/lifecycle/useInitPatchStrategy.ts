import type { UITask } from "@/entities/task";
import { useEffect } from "react";
import { useUIKeyStore } from "@/entities/task";
import { useTasksQueryState } from "@/features/tasks-management/model/query/useTasksQueryState";
import { useTasksPatchRuntime } from "@/features/tasks-management/model/strategies/patches/runtime/useTasksPatchRuntime";
import { usePatchFallbackEffect } from "@/features/tasks-management/model/strategies/patches/effects/usePatchFallbackEffect";
import { usePatchRecoveryEffect } from "@/features/tasks-management/model/strategies/patches/effects/usePatchRecoveryEffect";

export const useInitPatchStrategy = (uiTasks: UITask[]) => {
  const runtime = useTasksPatchRuntime();

  const { optimisticMode, scheduleQuerySync } = runtime;

  const { cleanupUIKeys } = useUIKeyStore.getState();

  const { isLoading } = useTasksQueryState();

  usePatchFallbackEffect(runtime, isLoading);
  usePatchRecoveryEffect(runtime);

  useEffect(() => {
    if (optimisticMode !== "patches") return;

    scheduleQuerySync(0);
  }, [optimisticMode, scheduleQuerySync]);

  useEffect(() => {
    if (optimisticMode !== "patches") return;

    cleanupUIKeys(uiTasks.map((task) => task.id));
  }, [uiTasks, cleanupUIKeys, optimisticMode]);
};
