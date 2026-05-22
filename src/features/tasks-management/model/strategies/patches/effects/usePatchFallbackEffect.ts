import type { TasksPatchRuntime } from "../types";
import { useEffect } from "react";
import { fallbackTasks } from "@/entities/task";

export const usePatchFallbackEffect = (
  runtime: TasksPatchRuntime,
  isLoading: boolean,
) => {
  const {
    optimisticMode,
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
  } = runtime;

  useEffect(() => {
    if (optimisticMode !== "patches") return;

    if (isServerAccessUncertain) return;

    const existing = queryClient.getQueryData([
      "tasks",
      optimisticMode,
    ]);

    if (!existing && isServerAccessBlocked && !isLoading) {
      queryClient.setQueryData(
        ["tasks", optimisticMode],
        fallbackTasks(),
      );
    }
  }, [
    optimisticMode,
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    isLoading,
  ]);
};