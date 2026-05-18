import { getHealth } from "./healthAPI";

export const checkHealth = async (): Promise<boolean> => {
  try {
    await getHealth();
    return true;
  } catch {
    return false;
  }
};
