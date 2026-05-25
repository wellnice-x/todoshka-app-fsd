import { TimeoutError } from "@/shared/lib/errors";
import { NoResponseError } from "@/shared/lib/errors";
import { UnauthorizedError } from "@/shared/lib/errors";
import axios from "axios";

export const handleAxiosError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      throw new TimeoutError();
    }

    if (!error.response) {
      throw new NoResponseError();
    }

    if (error.response.status === 401) {
      throw new UnauthorizedError();
    }

    throw new Error(
      error.response.data?.message ||
        `${error.response.status} ${error.response.statusText}`,
    );
  }

  throw error;
};
