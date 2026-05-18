import type { SimulationConfig } from "./config/types";
import { SimulatedNetworkLikeError } from "@/shared/lib/errors/simulation/SimulatedNetworkLikeError";
import { simulateDelay } from "./simulateDelay";

export const maybeFailWithUnknownOutcome = async (config: SimulationConfig) => {
  if (!config.enabled) return;

  await simulateDelay(config);

  if (Math.random() < config.chanceUnknownOutcome) {
    throw new SimulatedNetworkLikeError();
  }
};
