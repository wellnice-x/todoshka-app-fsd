import type { StrategyRuntimeContext } from "@/features/tasks-management/model/strategies/patches/types";
import { QUERY_KEY } from "@/features/tasks-management/model/strategies/patches/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQuerySyncScheduler,
  useQuerySyncWithOptionalToast,
} from "@/shared/lib/react-query";
import { createSyncHandler } from "@/features/tasks-management/model/strategies/patches/runtime/createSyncHandler";
import { useConnectionStore } from "@/shared/model/connection";
import { useCallback, useMemo } from "react";
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

  const resolveEntityId = useCallback(
    (id: string) => {
      return isServerAccessBlocked ? undefined : id;
    },
    [isServerAccessBlocked],
  );

  const getUpdatedAt = useCallback(() => {
    return queryClient.getQueryState(QUERY_KEY)?.dataUpdatedAt;
  }, [queryClient]);

  const handleSync = useMemo(
    () => createSyncHandler(queryClient, getUpdatedAt),
    [queryClient, getUpdatedAt],
  );

  return {
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    hasConnectionJustRecovered,
    scheduleQuerySync,
    syncWithOptionalToast,
    handleSync,
    resolveEntityId,
  };
};
