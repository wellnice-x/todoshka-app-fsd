import { useSettingsStore } from "@/shared/model/settings";
import { usePatchedTasksView } from "../strategies/patches/query-view/usePatchedTasksView";
import { useSnapshotTasksView } from "../strategies/snapshots/query-view/useSnapshotTasksView";
import { useNonOptimisticTasksView } from "../strategies/non-optimistic/query-view/useNonOptimisticTasksView";

export const useTasksView = () => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  const patchesModeTasks = usePatchedTasksView();
  const snapshotsModeTasks = useSnapshotTasksView();
  const noOptimisticModeTasks = useNonOptimisticTasksView();

  if (optimisticMode === "snapshots") return snapshotsModeTasks;
  if (optimisticMode === "patches") return patchesModeTasks;

  return noOptimisticModeTasks;
};
