import type { SimulationConfig } from "@/shared/lib/simulation/config/types";
import { useAppSettingsStore } from "@/app/model/settings/appSettingsStore";

export const getSimulationConfig = (): SimulationConfig => {
  const { isChaosMode } = useAppSettingsStore.getState();

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
