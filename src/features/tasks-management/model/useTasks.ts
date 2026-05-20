import useTasksPatches from "./strategies/useTasksPatches";
import useTasksSnapshots from "./strategies/useTasksSnapshots";
import useTasksNoOptimistic from "./strategies/useTasksNoOptimistic";
import { useSettingsStore } from "@/shared/model/settings";

export const useTasks = () => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  const patchesMode = useTasksPatches(optimisticMode);
  const snapshotsMode = useTasksSnapshots(optimisticMode);
  const noOptimisticMode = useTasksNoOptimistic(optimisticMode);

  if (optimisticMode === "snapshots") return snapshotsMode;
  if (optimisticMode === "patches") return patchesMode;

  return noOptimisticMode;
};
