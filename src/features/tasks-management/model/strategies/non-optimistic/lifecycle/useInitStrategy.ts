import type { UITask } from "@/entities/task";

import { useStrategyRuntime } from "../runtime/useStrategyRuntime";
import { useUIKeyStore } from "@/entities/task";
import { useEffect } from "react";

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
