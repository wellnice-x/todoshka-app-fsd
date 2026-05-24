import type { SimulationConfig } from "./types";
import { useSettingsStore } from "@/shared/model";

export const getSimulationConfig = (): SimulationConfig => {
  const { isChaosMode } = useSettingsStore.getState();

  if (!isChaosMode) {
    return {
      enabled: false,
      minDelay: 0,
      maxDelay: 0,
      chanceHard: 0,
      chanceUnknownOutcome: 0,
    };
  }

  return {
    enabled: true,
    minDelay: 100,
    maxDelay: 5000,
    chanceHard: 0.5,
    chanceUnknownOutcome: 0.5,
  };
};
