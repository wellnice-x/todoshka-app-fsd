import type { OptimisticMode } from "@/shared/types/optimisticMode";

export type ActionResult =
  | { ok: true; enabled: boolean }
  | { ok: false; reason: string };

export type SettingsStore = {
  isChaosMode: boolean;
  isOfflineMode: boolean;
  isBlockMutation: boolean;
  optimisticMode: OptimisticMode;
  setChaosMode: (value: boolean) => void;
  setOfflineMode: (value: boolean) => void;
  setBlockMutation: (value: boolean) => void;
  setOptimisticMode: (mode: OptimisticMode) => void;
  reset: () => void;
};
