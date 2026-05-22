import type { TasksNonOptimisticRuntime } from "@/features/tasks-management/model/strategies/non-optimistic/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQuerySyncScheduler,
  useQuerySyncWithOptionalToast,
} from "@/shared/lib/react-query";
import { useSettingsStore } from "@/shared/model/settings";
import { useServerAccessState } from "@/shared/model/access/useServerAccessState";

export const useTasksNonOptimisticRuntime = (): TasksNonOptimisticRuntime => {
  const queryClient = useQueryClient();

  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  const { isServerAccessBlocked } = useServerAccessState();

  const { scheduleQuerySync } = useQuerySyncScheduler([
    "tasks",
    optimisticMode,
  ]);

  const syncWithOptionalToast =
    useQuerySyncWithOptionalToast(scheduleQuerySync);

  return {
    optimisticMode,
    queryClient,
    isServerAccessBlocked,
    scheduleQuerySync,
    syncWithOptionalToast,
  };
};
