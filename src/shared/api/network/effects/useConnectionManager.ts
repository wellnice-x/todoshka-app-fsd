import type { ConnectionStatus } from "@/shared/api/network/model/connectionStore";
import {
  MutationCacheNotifyEvent,
  QueryCacheNotifyEvent,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { isSyncError, isNetworkError } from "@/shared/lib/error-utils";
import { useQuerySubscriptions } from "@/shared/lib/react-query";
import { useServerAccessState } from "@/shared/model/access";
import { useGlobalErrorStore } from "@/shared/model/errors";
import { useNetworkListeners } from "@/shared/lib/network";
import { useRuntimeStore } from "@/shared/model/runtime";
import { BulkDeleteError } from "@/shared/lib/errors";
import { useServerHealth } from "@/shared/api/health";
import { useConnection } from "@/shared/api/network/model/connectionStore";

const NETWORK_ERROR_THRESHOLD = 3;

export const useConnectionManager = () => {
  const [isConnectionUnstable, setIsConnectionUnstable] = useState(false);

  const isNoInternetConnection = useRuntimeStore(
    (state) => state.isNoInternetConnection,
  );
  const setIsNoInternetConnection = useRuntimeStore(
    (state) => state.setIsNoInternetConnection,
  );
  const resetErrorStore = useGlobalErrorStore((state) => state.reset);
  const {
    hasConnectionJustRecovered,
    setConnectionStatus,
    markConnectionLost,
    markConnectionRecovered,
    resetFlags,
  } = useConnection();

  const {
    isServerAccessBlocked,
    isServerBlockedByAuth,
    isServerBlockedByUser,
    isServerAccessUncertain,
  } = useServerAccessState();

  const { data, isError, isSuccess } = useServerHealth(isConnectionUnstable);

  const queryClient = useQueryClient();

  const isServerAccessBlockedRef = useRef(isServerAccessBlocked);
  const lastCertainStatusRef = useRef<ConnectionStatus>("checking");
  const networkErrorCountRef = useRef(0);

  const computedConnectionStatus: ConnectionStatus = (() => {
    if (isNoInternetConnection) return "offline";

    if (isServerBlockedByAuth && !isServerAccessUncertain) return "offline";

    if (isServerBlockedByUser || isConnectionUnstable) return "checking";

    if (isError) {
      return isServerAccessUncertain ? "checking" : "offline";
    }

    if (isSuccess) {
      return data ? "online" : "offline";
    }

    return "checking";
  })();

  const handleNetworkOffline = useCallback(() => {
    setIsNoInternetConnection(true);

    setIsConnectionUnstable(true);

    networkErrorCountRef.current = 0;

    if (lastCertainStatusRef.current === "online") {
      markConnectionLost();
    }

    lastCertainStatusRef.current = "offline";

    queryClient.resetQueries({ queryKey: ["serverHealth"] });
  }, [markConnectionLost, setIsNoInternetConnection, queryClient]);

  const handleNetworkOnline = useCallback(() => {
    networkErrorCountRef.current = 0;

    if (!isServerAccessBlockedRef.current) {
      queryClient.invalidateQueries({
        queryKey: ["serverHealth"],
        type: "active",
      });
    }
  }, [queryClient]);

  const handleQueryUpdate = useCallback(
    (event: QueryCacheNotifyEvent) => {
      if (event.type !== "updated") return;

      const query = event.query;
      const error = query.state.error;
      const queryData = query.state.data;
      const isConfirmedHealth = queryData === true;
      const isError = query.state.status === "error";
      const isSuccess = query.state.status === "success";
      const isHealthQuery = query.queryKey[0] === "serverHealth";
      const wasOnline = lastCertainStatusRef.current === "online";
      const wasOffline = lastCertainStatusRef.current === "offline";

      const { isNoInternetConnection } = useRuntimeStore.getState();

      if (!isHealthQuery) {
        if (!isNoInternetConnection && isSyncError(error)) {
          setIsConnectionUnstable(true);
        }

        return;
      }

      if (isSuccess && isConfirmedHealth) {
        setIsNoInternetConnection(false);

        setIsConnectionUnstable(false);

        if (wasOffline) {
          markConnectionRecovered();
        }

        networkErrorCountRef.current = 0;

        lastCertainStatusRef.current = "online";

        return;
      }

      if (isError || (isSuccess && !isConfirmedHealth)) {
        if (wasOnline) {
          markConnectionLost();
        }
        setIsConnectionUnstable(true);
      }
    },
    [markConnectionLost, markConnectionRecovered, setIsNoInternetConnection],
  );

  const handleMutationUpdate = useCallback(
    (event: MutationCacheNotifyEvent) => {
      if (event.type !== "updated") return;

      const mutation = event.mutation;
      const error = mutation.state.error;
      const isError = mutation.state.status === "error";
      const isSuccess = mutation.state.status === "success";
      const wasOnline = lastCertainStatusRef.current === "online";
      const wasOffline = lastCertainStatusRef.current === "offline";

      const { isNoInternetConnection } = useRuntimeStore.getState();

      if (isSuccess) {
        networkErrorCountRef.current = 0;
        return;
      }

      if (!isError) return;

      if (
        !wasOffline &&
        (isSyncError(error) || error instanceof BulkDeleteError)
      ) {
        setIsConnectionUnstable(true);
      }

      if (isNetworkError(error)) {
        networkErrorCountRef.current += 1;
        if (
          networkErrorCountRef.current >= NETWORK_ERROR_THRESHOLD &&
          !isNoInternetConnection
        ) {
          setIsNoInternetConnection(true);

          if (wasOnline) {
            markConnectionLost();
          }

          lastCertainStatusRef.current = "offline";

          queryClient.resetQueries({ queryKey: ["serverHealth"] });
        }
      } else {
        networkErrorCountRef.current = 0;
      }
    },
    [setIsNoInternetConnection, markConnectionLost, queryClient],
  );

  useNetworkListeners(handleNetworkOffline, handleNetworkOnline);

  useQuerySubscriptions(handleQueryUpdate, handleMutationUpdate);

  useEffect(() => {
    setConnectionStatus(computedConnectionStatus);
  }, [computedConnectionStatus, setConnectionStatus]);

  useEffect(() => {
    isServerAccessBlockedRef.current = isServerAccessBlocked;

    if (isServerAccessBlocked) return;

    queryClient.invalidateQueries({
      queryKey: ["serverHealth"],
      type: "active",
    });
  }, [isServerAccessBlocked, queryClient]);

  useEffect(() => {
    if (hasConnectionJustRecovered) {
      resetErrorStore();

      setTimeout(resetFlags, 0);
    }
  }, [hasConnectionJustRecovered, resetFlags, resetErrorStore]);
};
