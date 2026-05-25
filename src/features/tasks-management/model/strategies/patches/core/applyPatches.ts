import type { Patch } from "../types";
import type { Task } from "@/entities/task";

export const applyPatches = (tasks: Task[], patches: Patch[]) => {
  return patches.reduce((acc, patch) => patch.apply(acc), tasks);
};
