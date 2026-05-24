import type { Task } from "@/entities/task";
import type { Patch } from "@/features/tasks-management/model/strategies/patches/types";

export const applyPatches = (tasks: Task[], patches: Patch[]) => {
  return patches.reduce((acc, patch) => patch.apply(acc), tasks);
};
