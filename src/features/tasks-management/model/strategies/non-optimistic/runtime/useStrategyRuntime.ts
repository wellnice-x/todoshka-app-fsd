import type { StrategyRuntimeContext } from "@/features/tasks-management/model/strategies/non-optimistic/types";

import { QUERY_KEY } from "../queryKeys";
import {
  useQuerySyncScheduler,
  useQuerySyncWithOptionalToast,
} from "@/shared/lib/react-query";
import { useQueryClient } from "@tanstack/react-query";

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
