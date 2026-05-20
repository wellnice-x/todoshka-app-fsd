import { BulkDeleteError } from "@/shared/lib/errors";

export const isBulkDeleteError = (error: unknown): error is BulkDeleteError => {
  return error instanceof BulkDeleteError;
};