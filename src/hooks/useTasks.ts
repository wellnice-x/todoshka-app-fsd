import useTasksPatches from "./useTasksPatches";
import useTasksSnapshots from "./useTasksSnapshots";
import useTasksNoOptimistic from "./useTasksNoOptimistic";
import { useSettingsStore } from "@/app/model";

const useTasks = () => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  const patchesMode = useTasksPatches(optimisticMode);
  const snapshotsMode = useTasksSnapshots(optimisticMode);
  const noOptimisticMode = useTasksNoOptimistic(optimisticMode);

  if (optimisticMode === "snapshots") return snapshotsMode;
  if (optimisticMode === "patches") return patchesMode;

  return noOptimisticMode;
};

export default useTasks;
