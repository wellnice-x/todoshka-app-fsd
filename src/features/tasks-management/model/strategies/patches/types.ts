import type { Task } from "@/entities/task";
import type { QueryClient } from "@tanstack/react-query";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query/useQuerySyncScheduler";
import type { HandleSyncPatchesFn } from "./lib/createSyncHandler";
import type { QuerySyncWithOptionalToastFn } from "@/shared/lib/react-query/useQuerySyncWithOptionalToast";

export type PatchOperation = "create" | "update" | "delete";

export type Patch = {
  id: string;
  apply: (tasks: Task[]) => Task[];
  operation: PatchOperation;
  entityId?: string;
};

export type StrategyRuntimeContext = {
  queryClient: QueryClient;
  isServerAccessBlocked: boolean;
  isServerAccessUncertain: boolean;
  hasConnectionJustRecovered: boolean;
  scheduleQuerySync: ScheduleQuerySyncFn;
  syncWithOptionalToast: QuerySyncWithOptionalToastFn;
  handleSync: HandleSyncPatchesFn;
  resolveEntityId: (id: string) => string | undefined;
};
