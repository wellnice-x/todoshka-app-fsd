import { useSettingsStore } from "@/shared/model";
import { SimulatedBlockedMutationError } from "@/shared/lib/errors";

export const ensureCanMutate = async () => {
  const { isBlockMutation } = useSettingsStore.getState();

  if (!isBlockMutation) return;

  await new Promise<never>((_, reject) =>
    setTimeout(() => reject(new SimulatedBlockedMutationError()), 300),
  );
};