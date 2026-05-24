import type { PropsWithChildren } from "react";
import { useSettingsStore } from "@/shared/model";
import { PatchStrategyProvider } from "@/features/tasks-management/model/strategies/patches";
import { SnapshotStrategyProvider } from "@/features/tasks-management/model/strategies/snapshots";
import { NonOptimisticStrategyProvider } from "@/features/tasks-management/model/strategies/non-optimistic";

export const TasksStrategyProvider = ({ children }: PropsWithChildren) => {
  const optimisticMode = useSettingsStore((state) => state.optimisticMode);

  switch (optimisticMode) {
    case "patches":
      return (
        <PatchStrategyProvider>
          {children}
        </PatchStrategyProvider>
      );

    case "snapshots":
      return (
        <SnapshotStrategyProvider>
          {children}
        </SnapshotStrategyProvider>
      );

    case "none":
      return (
        <NonOptimisticStrategyProvider>
          {children}
        </NonOptimisticStrategyProvider>
      );
  }
};
