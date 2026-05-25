import type { StrategyRuntimeContext } from "../types";

import { QUERY_KEY } from "../queryKeys";
import { fallbackTasks } from "@/entities/task";
import { useEffect } from "react";

export const useFallbackTasksEffect = (
  runtime: StrategyRuntimeContext,
  isLoading: boolean,
) => {
  const { queryClient, isServerAccessBlocked, isServerAccessUncertain } =
    runtime;

  useEffect(() => {
    if (isServerAccessUncertain) return;

    const existing = queryClient.getQueryData(QUERY_KEY);

    if (!existing && isServerAccessBlocked && !isLoading) {
      queryClient.setQueryData(QUERY_KEY, fallbackTasks());
    }
  }, [queryClient, isServerAccessBlocked, isServerAccessUncertain, isLoading]);
};
