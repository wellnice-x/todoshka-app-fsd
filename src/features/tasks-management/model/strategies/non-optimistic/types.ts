import type { QueryClient } from "@tanstack/react-query";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query/useQuerySyncScheduler";
import type { QuerySyncWithOptionalToastFn } from "@/shared/lib/react-query/useQuerySyncWithOptionalToast";

export type StrategyRuntimeContext = {
  queryClient: QueryClient;
  scheduleQuerySync: ScheduleQuerySyncFn;
  syncWithOptionalToast: QuerySyncWithOptionalToastFn;
};
