import type { SimulationConfig } from "./configuration/types";

const randomTime = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const simulateDelay = async (config: SimulationConfig) => {
  if (!config.enabled) return;

  const delay = randomTime(config.minDelay, config.maxDelay);
  await new Promise((resolve) => setTimeout(resolve, delay));
};
