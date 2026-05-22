import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQuerySyncScheduler,
  useQuerySyncWithOptionalToast,
} from "@/shared/lib/react-query";
import { useSettingsStore } from "@/shared/model/settings";
import { createHandleSync } from "../lib/createHandleSync";
import { useConnectionStore } from "@/shared/api/network";
import { useServerAccessState } from "@/shared/model/access/useServerAccessState";
import type { TasksSnapshotsRuntime } from "../types";

export const useTasksSnapshotsRuntime = (): TasksSnapshotsRuntime => {
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

  const handleSync = useMemo(
    () => createHandleSync(queryClient, optimisticMode),
    [queryClient, optimisticMode],
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
  };
};
