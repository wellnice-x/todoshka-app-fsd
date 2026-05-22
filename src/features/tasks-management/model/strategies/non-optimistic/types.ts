import type { QueryClient } from "@tanstack/react-query";
import type { OptimisticMode } from "@/shared/types/optimisticMode";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query/useQuerySyncScheduler";
import type { QuerySyncWithOptionalToastFn } from "@/shared/lib/react-query/useQuerySyncWithOptionalToast";

export type TasksNonOptimisticRuntime = {
  optimisticMode: OptimisticMode;
  queryClient: QueryClient;
  isServerAccessBlocked: boolean;
  scheduleQuerySync: ScheduleQuerySyncFn;
  syncWithOptionalToast: QuerySyncWithOptionalToastFn;
};
