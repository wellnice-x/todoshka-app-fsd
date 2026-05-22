import { useQueryClient } from "@tanstack/react-query";
import {
  useQuerySyncScheduler,
  useQuerySyncWithOptionalToast,
} from "@/shared/lib/react-query";
import { useSettingsStore } from "@/shared/model/settings";
import { createHandleSync } from "../lib/createHandleSync";
import { useConnectionStore } from "@/shared/api/network";
import { useCallback, useMemo } from "react";
import { useServerAccessState } from "@/shared/model/access/useServerAccessState";
import type { TasksPatchRuntime } from "@/features/tasks-management/model/strategies/patches/types";

export const useTasksPatchRuntime = (): TasksPatchRuntime => {
  const queryClient = useQueryClient();

  const optimisticMode = useSettingsStore((s) => s.optimisticMode);

  const { isServerAccessBlocked, isServerAccessUncertain } =
    useServerAccessState();

  const hasConnectionJustRecovered = useConnectionStore(
    (state) => state.hasConnectionJustRecovered,
  );

  const { scheduleQuerySync } = useQuerySyncScheduler([
    "tasks",
    optimisticMode,
  ]);

  const syncWithOptionalToast =
    useQuerySyncWithOptionalToast(scheduleQuerySync);

  const resolveEntityId = useCallback(
    (id: string) => {
      return isServerAccessBlocked ? undefined : id;
    },
    [isServerAccessBlocked],
  );

  const getUpdatedAt = useCallback(() => {
    return queryClient.getQueryState(["tasks", optimisticMode])?.dataUpdatedAt;
  }, [queryClient, optimisticMode]);

  const handleSync = useMemo(
    () => createHandleSync(queryClient, getUpdatedAt),
    [queryClient, getUpdatedAt],
  );

  return {
    optimisticMode,

    queryClient,

    isServerAccessBlocked,
    isServerAccessUncertain,

    hasConnectionJustRecovered,

    scheduleQuerySync,
    syncWithOptionalToast,
    handleSync,

    resolveEntityId,
  };
};
