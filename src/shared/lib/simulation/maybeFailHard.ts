import type { SimulationConfig } from "./config/types";
import { SimulatedRequestError } from "@/shared/lib/errors/simulation/SimulatedRequestError";
import { simulateDelay } from "./simulateDelay";

export const maybeFailHard = async (config: SimulationConfig) => {
  if (!config.enabled) return;

  if (Math.random() < config.chanceHard) {
    await simulateDelay(config);

    throw new SimulatedRequestError();
  }
};