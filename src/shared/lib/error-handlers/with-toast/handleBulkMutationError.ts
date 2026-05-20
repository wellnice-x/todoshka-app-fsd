import toast from "react-hot-toast";
import { handleMutationError } from "./handleMutationError";
import { BulkDeleteError } from "@/shared/lib/errors";

type DeleteSettledResult = PromiseSettledResult<{ taskId: string }>;

export const handleBulkMutationError = (error: unknown) => {
  if (handleMutationError(error)) return true;

  if (!(error instanceof BulkDeleteError)) {
    toast.error("Server sync failed");
    return true;
  }

  const results = error.results as DeleteSettledResult[];

  if (!results.length) {
    toast.error("Server sync failed");
    return true;
  }

  const hasKnownError = results.some(
    (result) =>
      result.status === "rejected" && handleMutationError(result.reason),
  );

  if (hasKnownError) return true;

  const failedCount = results.filter(
    (result) => result.status === "rejected",
  ).length;

  const totalCount = results.length;

  if (failedCount === totalCount) {
    toast.error("Failed to delete tasks");
    return true;
  }

  toast("Some tasks were not deleted", { icon: "⚠️" });
  return true;
};
