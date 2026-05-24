import type { StrategyRuntimeContext } from "@/features/tasks-management/model/strategies/snapshots/types";
import { useMemo } from "react";
import { QUERY_KEY } from "@/features/tasks-management/model/strategies/snapshots/config";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQuerySyncScheduler,
  useQuerySyncWithOptionalToast,
} from "@/shared/lib/react-query";
import { createSyncHandler } from "@/features/tasks-management/model/strategies/snapshots/lib/createSyncHandler";
import { useConnectionStore } from "@/shared/api/network";
import { useServerAccessState } from "@/shared/model/access";


export const useStrategyRuntime = (): StrategyRuntimeContext => {
  const queryClient = useQueryClient();

  const { isServerAccessBlocked, isServerAccessUncertain } =
    useServerAccessState();

  const hasConnectionJustRecovered = useConnectionStore(
    (state) => state.hasConnectionJustRecovered,
  );

  const { scheduleQuerySync } = useQuerySyncScheduler(QUERY_KEY);

  const syncWithOptionalToast =
    useQuerySyncWithOptionalToast(scheduleQuerySync);

  const handleSync = useMemo(
    () => createSyncHandler(queryClient, QUERY_KEY),
    [queryClient],
  );

  return {
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    hasConnectionJustRecovered,
    scheduleQuerySync,
    syncWithOptionalToast,
    handleSync,
  };
};
