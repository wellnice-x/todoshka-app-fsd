import { useQuery } from "@tanstack/react-query";

export const useInitPatchesCache = () => {
  useQuery({
    queryKey: ["tasksPatches"],
    queryFn: () => [],
    enabled: false,
    initialData: [],
  });
};
