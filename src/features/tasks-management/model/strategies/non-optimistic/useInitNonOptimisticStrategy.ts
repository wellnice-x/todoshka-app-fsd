import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { tasksUseCases } from "@/entities/task";
import { useTasksNonOptimisticRuntime } from "./runtime/useTasksNonOptimisticRuntime";

const useInitNonOptimisticStrategy = () => {
  const runtime = useTasksNonOptimisticRuntime();

  const { optimisticMode, isServerAccessBlocked, scheduleQuerySync } = runtime;

  useQuery({
    queryKey: ["tasks", optimisticMode],
    queryFn: tasksUseCases.getAll,
    enabled: optimisticMode === "none" && !isServerAccessBlocked,
  });

  useEffect(() => {
    if (optimisticMode !== "none") return;

    scheduleQuerySync(0);
  }, [optimisticMode, scheduleQuerySync]);
};

export default useInitNonOptimisticStrategy;
