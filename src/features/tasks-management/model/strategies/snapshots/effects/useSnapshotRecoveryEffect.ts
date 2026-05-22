import type { Task } from "@/entities/task";
import type { TasksSnapshotsRuntime } from "@/features/tasks-management/model/strategies/snapshots/types";
import { useEffect, useRef } from "react";
import { useRuntimeStore } from "@/shared/model/runtime/runtimeStore";
import { handlePromiseWithToast } from "@/shared/lib/toast/handlePromiseWithToast";

export const useSnapshotRecoveryEffect = (runtime: TasksSnapshotsRuntime) => {
  const {
    optimisticMode,
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    hasConnectionJustRecovered,
    scheduleQuerySync,
  } = runtime;

  const wasServerBlockedRef = useRef(false);
  const shouldSyncAfterUnblockRef = useRef(false);

  useEffect(() => {
    if (optimisticMode !== "snapshots") return;

    if (isServerAccessUncertain) return;

    const { isNoInternetConnection } = useRuntimeStore.getState();

    const wasBlocked = wasServerBlockedRef.current;
    const isNowBlocked = isServerAccessBlocked;

    const hasServerUnblocked = wasBlocked && !isNowBlocked;

    if (hasServerUnblocked) {
      shouldSyncAfterUnblockRef.current = true;
    }

    if (
      shouldSyncAfterUnblockRef.current &&
      (hasConnectionJustRecovered || !isNoInternetConnection)
    ) {
      shouldSyncAfterUnblockRef.current = false;

      const removeOfflineAndFallbackTasks = (tasks: Task[]) => {
        return tasks.filter(
          (task) =>
            !task.id.startsWith("offline-") && !task.id.startsWith("fallback-"),
        );
      };

      queryClient.setQueryData<Task[]>(["tasks", optimisticMode], (old = []) =>
        removeOfflineAndFallbackTasks(old),
      );

      handlePromiseWithToast(
        scheduleQuerySync(0, true, true),
        {
          success: "Synced. Interface is up to date",
        },
        2500,
        "✅",
      );
    } else if (hasConnectionJustRecovered) {
      scheduleQuerySync(0);
    }

    wasServerBlockedRef.current = isNowBlocked;
  }, [
    optimisticMode,
    queryClient,
    isServerAccessBlocked,
    isServerAccessUncertain,
    hasConnectionJustRecovered,
    scheduleQuerySync,
  ]);
};
