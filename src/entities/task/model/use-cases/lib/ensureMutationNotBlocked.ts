import { useSettingsStore } from "@/app/model";
import { SimulatedBlockedMutationError } from "@/shared/lib/errors/simulation/SimulatedBlockedMutationError";

export const ensureMutationNotBlocked = async () => {
  const { isBlockMutation } = useSettingsStore.getState();

  if (!isBlockMutation) return;

  await new Promise<never>((_, reject) =>
    setTimeout(() => reject(new SimulatedBlockedMutationError()), 300),
  );
};