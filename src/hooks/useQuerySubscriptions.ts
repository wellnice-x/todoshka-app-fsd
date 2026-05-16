import { useEffect } from "react";
import {
  MutationCacheNotifyEvent,
  QueryCacheNotifyEvent,
} from "@tanstack/react-query";
import queryClient from "@/lib/react-query/queryClient";

type UseQuerySubscriptions = (
  onQueryUpdate: (event: QueryCacheNotifyEvent) => void,
  onMutationUpdate: (event: MutationCacheNotifyEvent) => void,
) => void;

const useQuerySubscriptions: UseQuerySubscriptions = (
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

export default useQuerySubscriptions;
