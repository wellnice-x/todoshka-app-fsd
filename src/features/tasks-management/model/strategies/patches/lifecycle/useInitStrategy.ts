import type { UITask } from "@/entities/task";

import { useTasksQueryState } from "@/features/tasks-management/model/react-query/useTasksQueryState";
import { useStrategyRuntime } from "../runtime/useStrategyRuntime";
import { useRecoverySyncEffect } from "../effects/useRecoverySyncEffect";
import { useFallbackTasksEffect } from "../effects/useFallbackTasksEffect";
import { useUIKeyStore } from "@/entities/task";
import { useEffect } from "react";

export const useInitStrategy = (uiTasks: UITask[]) => {
  const runtime = useStrategyRuntime();

  const { scheduleQuerySync } = runtime;

  const { cleanupUIKeys } = useUIKeyStore.getState();

  const { isLoading } = useTasksQueryState();

  useFallbackTasksEffect(runtime, isLoading);
  useRecoverySyncEffect(runtime);

  useEffect(() => {
    scheduleQuerySync(0);
  }, [scheduleQuerySync]);

  useEffect(() => {
    cleanupUIKeys(uiTasks.map((task) => task.id));
  }, [uiTasks, cleanupUIKeys]);
};
