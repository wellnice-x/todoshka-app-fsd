import type { QueryClient } from "@tanstack/react-query";
import type { OptimisticMode } from "@/shared/types/optimisticMode";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query/useQuerySyncScheduler";
import type { QuerySyncWithOptionalToastFn } from "@/shared/lib/react-query/useQuerySyncWithOptionalToast";
import type { HandleSyncFn } from "./lib/createHandleSync";

export type TasksSnapshotsRuntime = {
  optimisticMode: OptimisticMode;
  queryClient: QueryClient;
  isServerAccessBlocked: boolean;
  isServerAccessUncertain: boolean;
  hasConnectionJustRecovered: boolean;
  scheduleQuerySync: ScheduleQuerySyncFn;
  syncWithOptionalToast: QuerySyncWithOptionalToastFn;
  handleSync: HandleSyncFn;
};
