import type { QueryClient } from "@tanstack/react-query";
import type { HandleSyncFn } from "./runtime/createSyncHandler";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query";
import type { QuerySyncWithOptionalToastFn } from "@/shared/lib/react-query";

export type StrategyRuntimeContext = {
  queryClient: QueryClient;
  isServerAccessBlocked: boolean;
  isServerAccessUncertain: boolean;
  hasConnectionJustRecovered: boolean;
  scheduleQuerySync: ScheduleQuerySyncFn;
  syncWithOptionalToast: QuerySyncWithOptionalToastFn;
  handleSync: HandleSyncFn;
};
