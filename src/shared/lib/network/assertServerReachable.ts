import { ServerUnreachableError } from "@/shared/lib/errors";
import { checkHealth } from "@/shared/api/health";

export const assertServerReachable = async () => {
  const ok = await checkHealth();

  if (!ok) {
    throw new ServerUnreachableError();
  }
};
