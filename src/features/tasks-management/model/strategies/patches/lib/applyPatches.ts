import type { Task } from "@/entities/task";
import type { Patch } from "../types";

export const applyPatches = (tasks: Task[], patches: Patch[]) => {
  return patches.reduce((acc, patch) => patch.apply(acc), tasks);
};
