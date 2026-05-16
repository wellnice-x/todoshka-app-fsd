import { TimeoutError } from "./network/TimeoutError";
import { BulkDeleteError } from "./mutations/BulkDeleteError";
import { NoResponseError } from "./network/NoResponseError";
import { SimulatedRequestError } from "./simulation/SimulatedRequestError";
import { SimulatedNetworkLikeError } from "./simulation/SimulatedNetworkLikeError";

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
