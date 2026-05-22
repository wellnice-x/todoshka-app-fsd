import type { Task } from "@/entities/task";
import type { QueryClient } from "@tanstack/react-query";
import type { OptimisticMode } from "@/shared/types/optimisticMode";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query/useQuerySyncScheduler";
import type { HandleSyncPatchesFn } from "./lib/createHandleSync";
import type { QuerySyncWithOptionalToastFn } from "@/shared/lib/react-query/useQuerySyncWithOptionalToast";

export type PatchOperation = "create" | "update" | "delete";

export type Patch = {
  id: string;
  apply: (tasks: Task[]) => Task[];
  operation: PatchOperation;
  entityId?: string;
};

export type TasksPatchRuntime = {
  optimisticMode: OptimisticMode;
  queryClient: QueryClient;
  isServerAccessBlocked: boolean;
  isServerAccessUncertain: boolean;
  hasConnectionJustRecovered: boolean;
  scheduleQuerySync: ScheduleQuerySyncFn;
  syncWithOptionalToast: QuerySyncWithOptionalToastFn;
  handleSync: HandleSyncPatchesFn;
  resolveEntityId: (id: string) => string | undefined;
};
