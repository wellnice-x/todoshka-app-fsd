import { ServerUnreachableError } from "@/shared/lib/errors/domain/ServerUnavailableError";
import { checkHealth } from "@/shared/api/health/healthService";

export const assertServerReachable = async () => {
  const ok = await checkHealth();

  if (!ok) {
    throw new ServerUnreachableError();
  }
};
