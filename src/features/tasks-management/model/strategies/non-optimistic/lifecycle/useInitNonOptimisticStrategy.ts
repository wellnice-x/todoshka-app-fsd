import type { UITask } from "@/entities/task";
import { useEffect } from "react";
import { useUIKeyStore } from "@/entities/task";
import { useTasksNonOptimisticRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/runtime/useTasksNonOptimisticRuntime";

export const useInitNonOptimisticStrategy = (uiTasks: UITask[]) => {
  const runtime = useTasksNonOptimisticRuntime();

  const { cleanupUIKeys } = useUIKeyStore.getState();

  const { optimisticMode, scheduleQuerySync } = runtime;

  useEffect(() => {
    if (optimisticMode !== "none") return;

    scheduleQuerySync(0);
  }, [optimisticMode, scheduleQuerySync]);

  useEffect(() => {
    if (optimisticMode !== "none") return;

    cleanupUIKeys(uiTasks.map((task) => task.id));
  }, [uiTasks, cleanupUIKeys, optimisticMode]);
};
