import type { Task } from "@/entities/task";
import type {
  Patch,
  TasksPatchRuntime,
} from "@/features/tasks-management/model/strategies/patches/types";
import { useEffect, useRef } from "react";
import { useRuntimeStore } from "@/shared/model/runtime/runtimeStore";
import { handlePromiseWithToast } from "@/shared/lib/toast/handlePromiseWithToast";

export const usePatchRecoveryEffect = (runtime: TasksPatchRuntime) => {
  const {
    optimisticMode,
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
    if (optimisticMode !== "patches") return;

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

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        removeOfflineAndFallbackTasks(old),
      );

      queryClient.setQueryData<Patch[]>(["tasksPatches"], []);
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
    optimisticMode,
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    hasConnectionJustRecovered,
    scheduleQuerySync,
    handleSync,
  ]);
};
