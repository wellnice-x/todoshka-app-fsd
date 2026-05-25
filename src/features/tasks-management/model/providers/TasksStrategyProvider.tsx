import type { PropsWithChildren } from "react";

import { PatchStrategyProvider } from "../strategies/patches";
import { SnapshotStrategyProvider } from "../strategies/snapshots";
import { NonOptimisticStrategyProvider } from "../strategies/non-optimistic";
import { useSettingsStore } from "@/shared/model";

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
