import type { SimulationConfig } from "./configuration/types";
import { SimulatedNetworkLikeError } from "@/shared/lib/errors";
import { simulateDelay } from "./simulateDelay";

export const maybeFailWithUnknownOutcome = async (config: SimulationConfig) => {
  if (!config.enabled) return;

  await simulateDelay(config);

  if (Math.random() < config.chanceUnknownOutcome) {
    throw new SimulatedNetworkLikeError();
  }
};
