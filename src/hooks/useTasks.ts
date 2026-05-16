import useTasksPatches from "./useTasksPatches";
import useTasksSnapshots from "./useTasksSnapshots";
import useTasksNoOptimistic from "./useTasksNoOptimistic";
import { useAppSettingsStore } from "@/stores/appSettingsStore";

const useTasks = () => {
  const optimisticMode = useAppSettingsStore((state) => state.optimisticMode);

  const patchesMode = useTasksPatches(optimisticMode);
  const snapshotsMode = useTasksSnapshots(optimisticMode);
  const noOptimisticMode = useTasksNoOptimistic(optimisticMode);

  if (optimisticMode === "snapshots") return snapshotsMode;
  if (optimisticMode === "patches") return patchesMode;

  return noOptimisticMode;
};

export default useTasks;
