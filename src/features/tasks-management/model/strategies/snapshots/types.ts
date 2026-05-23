import type { QueryClient } from "@tanstack/react-query";
import type { HandleSyncFn } from "./lib/createSyncHandler";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query/useQuerySyncScheduler";
import type { QuerySyncWithOptionalToastFn } from "@/shared/lib/react-query/useQuerySyncWithOptionalToast";

export type StrategyRuntimeContext = {
  queryClient: QueryClient;
  isServerAccessBlocked: boolean;
  isServerAccessUncertain: boolean;
  hasConnectionJustRecovered: boolean;
  scheduleQuerySync: ScheduleQuerySyncFn;
  syncWithOptionalToast: QuerySyncWithOptionalToastFn;
  handleSync: HandleSyncFn;
};
