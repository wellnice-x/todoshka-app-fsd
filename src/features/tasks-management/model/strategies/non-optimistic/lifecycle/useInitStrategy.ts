import type { UITask } from "@/entities/task";
import { useEffect } from "react";
import { useUIKeyStore } from "@/entities/task";
import { useStrategyRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/runtime/useStrategyRuntime";

export const useInitStrategy = (uiTasks: UITask[]) => {
  const runtime = useStrategyRuntime();

  const { cleanupUIKeys } = useUIKeyStore.getState();

  const { scheduleQuerySync } = runtime;

  useEffect(() => {
    scheduleQuerySync(0);
  }, [scheduleQuerySync]);

  useEffect(() => {
    cleanupUIKeys(uiTasks.map((task) => task.id));
  }, [uiTasks, cleanupUIKeys]);
};
