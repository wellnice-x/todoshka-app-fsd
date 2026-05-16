import useServerAccessState from "./useServerAccessState";
import { useQuery } from "@tanstack/react-query";
import { tasksService } from "@/services/tasksService";

const useServerHealth = (isAggressiveProbe: boolean) => {
  const { isServerAccessBlocked } = useServerAccessState();

  return useQuery({
    queryKey: ["serverHealth"],
    queryFn: () => {
      if (isServerAccessBlocked) {
        return false;
      }
      return tasksService.checkHealth();
    },
    enabled: !isServerAccessBlocked,
    refetchInterval: () => (isAggressiveProbe ? 10_000 : 60_000),
    refetchIntervalInBackground: true,
    retry: isAggressiveProbe ? 0 : 1,
  });
};

export default useServerHealth;
