import type { QuerySyncWithOptionalToastFn } from "@/shared/lib/react-query";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query";
import type { QueryClient } from "@tanstack/react-query";

export type StrategyRuntimeContext = {
  queryClient: QueryClient;
  scheduleQuerySync: ScheduleQuerySyncFn;
  syncWithOptionalToast: QuerySyncWithOptionalToastFn;
};
