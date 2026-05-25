import type { Patch, StrategyRuntimeContext } from "../types";
import type { Task } from "@/entities/task";

import { QUERY_KEY, PATCHES_QUERY_KEY } from "../queryKeys";
import { handlePromiseWithToast } from "@/shared/lib/toast";
import { useRuntimeStore } from "@/shared/model";
import { useEffect, useRef } from "react";

export const useRecoverySyncEffect = (runtime: StrategyRuntimeContext) => {
  const {
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    hasConnectionJustRecovered,
    scheduleQuerySync,
    handleSync,
  } = runtime;

  const wasServerBlockedRef = useRef(false);
  const shouldSyncAfterUnblockRef = useRef(false);

  useEffect(() => {
    if (isServerAccessUncertain) return;

    const { isNoInternetConnection } = useRuntimeStore.getState();

    const wasBlocked = wasServerBlockedRef.current;
    const isNowBlocked = isServerAccessBlocked;

    const hasServerUnblocked = wasBlocked && !isNowBlocked;

    if (hasServerUnblocked) {
      shouldSyncAfterUnblockRef.current = true;

      const removeOfflineAndFallbackTasks = (tasks: Task[]) => {
        return tasks.filter(
          (task) =>
            !task.id.startsWith("offline-") && !task.id.startsWith("fallback-"),
        );
      };

      queryClient.setQueryData<Task[]>(QUERY_KEY, (old = []) =>
        removeOfflineAndFallbackTasks(old),
      );

      queryClient.setQueryData<Patch[]>(PATCHES_QUERY_KEY, []);
    }

    if (
      shouldSyncAfterUnblockRef.current &&
      (hasConnectionJustRecovered || !isNoInternetConnection)
    ) {
      shouldSyncAfterUnblockRef.current = false;

      handlePromiseWithToast(
        scheduleQuerySync(0, true, true),
        {
          success: "Synced. Interface is up to date",
        },
        2500,
        "✅",
      );
    } else if (hasConnectionJustRecovered) {
      handleSync(scheduleQuerySync(0, false, true));
    }

    wasServerBlockedRef.current = isNowBlocked;
  }, [
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    hasConnectionJustRecovered,
    scheduleQuerySync,
    handleSync,
  ]);
};
