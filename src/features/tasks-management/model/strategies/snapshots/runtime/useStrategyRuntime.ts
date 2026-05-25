import type { StrategyRuntimeContext } from "../types";

import { QUERY_KEY } from "../queryKeys";
import { createSyncHandler } from "../runtime/createSyncHandler";
import { useConnectionStore } from "@/shared/model";
import { useServerAccessState } from "@/shared/model";
import {
  useQuerySyncScheduler,
  useQuerySyncWithOptionalToast,
} from "@/shared/lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

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
