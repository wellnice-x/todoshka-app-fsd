import { useAppSettingsStore } from "@/app/model/settings/appSettingsStore";
import { SimulatedBlockedMutationError } from "@/shared/lib/errors/simulation/SimulatedBlockedMutationError";

export const ensureMutationNotBlocked = async () => {
  const { isBlockMutation } = useAppSettingsStore.getState();

  if (!isBlockMutation) return;

  await new Promise<never>((_, reject) =>
    setTimeout(() => reject(new SimulatedBlockedMutationError()), 300),
  );
};