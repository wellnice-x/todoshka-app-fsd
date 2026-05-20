import { useQuery } from "@tanstack/react-query";
import { checkHealth } from "@/shared/api/health";
import { useServerAccessState } from "@/shared/model/access/useServerAccessState";

export const useServerHealth = (isAggressiveProbe: boolean) => {
  const { isServerAccessBlocked } = useServerAccessState();

  return useQuery({
    queryKey: ["serverHealth"],
    queryFn: () => {
      if (isServerAccessBlocked) {
        return false;
      }
      return checkHealth();
    },
    enabled: !isServerAccessBlocked,
    refetchInterval: () => (isAggressiveProbe ? 10_000 : 60_000),
    refetchIntervalInBackground: true,
    retry: isAggressiveProbe ? 0 : 1,
  });
};
