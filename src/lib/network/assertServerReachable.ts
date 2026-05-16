import { ServerUnreachableError } from "../errors/domain/ServerUnavailableError";
import { tasksService } from "@/services/tasksService";

export const assertServerReachable = async () => {
  const ok = await tasksService.checkHealth();

  if (!ok) {
    throw new ServerUnreachableError();
  }
};
