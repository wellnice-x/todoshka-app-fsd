import type { SimulationConfig } from "@/shared/lib/simulation/config/types";
import { useSettingsStore } from "@/shared/model/settings";

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
