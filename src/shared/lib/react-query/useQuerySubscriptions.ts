import { useEffect } from "react";
import {
  MutationCacheNotifyEvent,
  QueryCacheNotifyEvent,
} from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/react-query";

type UseQuerySubscriptions = (
  onQueryUpdate: (event: QueryCacheNotifyEvent) => void,
  onMutationUpdate: (event: MutationCacheNotifyEvent) => void,
) => void;

export const useQuerySubscriptions: UseQuerySubscriptions = (
  onQueryUpdate,
  onMutationUpdate,
) => {
  useEffect(() => {
    const unSubQuery = queryClient.getQueryCache().subscribe(onQueryUpdate);

    const unSubMutation = queryClient
      .getMutationCache()
      .subscribe(onMutationUpdate);

    return () => {
      unSubQuery();
      unSubMutation();
    };
  }, [onQueryUpdate, onMutationUpdate]);
};