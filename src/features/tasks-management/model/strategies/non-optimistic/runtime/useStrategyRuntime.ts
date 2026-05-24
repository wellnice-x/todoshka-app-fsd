import type { StrategyRuntimeContext } from "@/features/tasks-management/model/strategies/non-optimistic/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQuerySyncScheduler,
  useQuerySyncWithOptionalToast,
} from "@/shared/lib/react-query";
import { QUERY_KEY } from "@/features/tasks-management/model/strategies/non-optimistic/queryKeys";

export const useStrategyRuntime = (): StrategyRuntimeContext => {
  const queryClient = useQueryClient();

  const { scheduleQuerySync } = useQuerySyncScheduler(QUERY_KEY);

  const syncWithOptionalToast =
    useQuerySyncWithOptionalToast(scheduleQuerySync);

  return {
    queryClient,
    scheduleQuerySync,
    syncWithOptionalToast,
  };
};
