import { BulkDeleteError } from "./mutations/BulkDeleteError";

export const isBulkDeleteError = (error: unknown): error is BulkDeleteError => {
  return error instanceof BulkDeleteError;
};