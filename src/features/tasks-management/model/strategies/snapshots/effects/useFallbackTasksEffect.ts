import type { StrategyRuntimeContext } from "@/features/tasks-management/model/strategies/snapshots/types";
import { useEffect } from "react";
import { fallbackTasks } from "@/entities/task";
import { QUERY_KEY } from "@/features/tasks-management/model/strategies/snapshots/config";

export const useFallbackTasksEffect = (
  runtime: StrategyRuntimeContext,
  isLoading: boolean,
) => {
  const {
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
  } = runtime;

  useEffect(() => {
    if (isServerAccessUncertain) return;

    const existing = queryClient.getQueryData(QUERY_KEY);

    if (!existing && isServerAccessBlocked && !isLoading) {
      queryClient.setQueryData(QUERY_KEY, fallbackTasks());
    }
  }, [
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    isLoading,
  ]);
};
