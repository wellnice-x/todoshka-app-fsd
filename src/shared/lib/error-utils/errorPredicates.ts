import { TimeoutError } from "@/shared/lib/errors";
import { BulkDeleteError } from "@/shared/lib/errors";
import { NoResponseError } from "@/shared/lib/errors";
import { SimulatedRequestError } from "@/shared/lib/errors";
import { SimulatedNetworkLikeError } from "@/shared/lib/errors";

export const isNetworkError = (error: unknown) =>
  error instanceof TimeoutError ||
  error instanceof NoResponseError ||
  error instanceof SimulatedNetworkLikeError;

export const isSyncError = (error: unknown) =>
  error instanceof SimulatedRequestError || isNetworkError(error);

export const isBulkDeleteNetworkError = (error: unknown): boolean => {
  if (!(error instanceof BulkDeleteError)) return false;

  return error.results.some(
    (res) => res.status === "rejected" && isNetworkError(res.reason),
  );
};
