import type { HandleSyncPatchesFn } from "./runtime/createSyncHandler";
import type { Task } from "@/entities/task";
import type { ScheduleQuerySyncFn } from "@/shared/lib/react-query";
import type { QuerySyncWithOptionalToastFn } from "@/shared/lib/react-query";
import type { QueryClient } from "@tanstack/react-query";

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
