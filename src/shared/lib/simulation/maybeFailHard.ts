import type { SimulationConfig } from "./configuration/types";

import { SimulatedRequestError } from "@/shared/lib/errors";
import { simulateDelay } from "./simulateDelay";

export const maybeFailHard = async (config: SimulationConfig) => {
  if (!config.enabled) return;

  if (Math.random() < config.chanceHard) {
    await simulateDelay(config);

    throw new SimulatedRequestError();
  }
};