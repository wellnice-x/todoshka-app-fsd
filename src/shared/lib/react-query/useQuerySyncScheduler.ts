import { useQueryClient, QueryKey } from "@tanstack/react-query";
import { assertServerReachable } from "@/shared/lib/network";
import { useCallback, useEffect, useRef } from "react";

export type ScheduleQuerySyncFn = (
  delay?: number,
  isPriority?: boolean,
  awaitFetch?: boolean,
) => Promise<void>;

export const useQuerySyncScheduler = (queryKey: QueryKey) => {
  const queryClient = useQueryClient();

  const queryKeyRef = useRef(queryKey);

  const baseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const priorityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const baseResolveRef = useRef<(() => void) | null>(null);
  const priorityResolveRef = useRef<(() => void) | null>(null);

  const scheduleQuerySync = useCallback<ScheduleQuerySyncFn>(
    (delay = 1000, isPriority = false, awaitFetch = false) => {
      const timeoutRef = isPriority ? priorityTimeoutRef : baseTimeoutRef;
      const resolveRef = isPriority ? priorityResolveRef : baseResolveRef;

      if (isPriority && baseTimeoutRef.current) {
        clearTimeout(baseTimeoutRef.current);
        baseTimeoutRef.current = null;

        baseResolveRef.current?.();
        baseResolveRef.current = null;
      }

      return new Promise<void>((resolve, reject) => {
        const currentResolve = resolve;
        resolveRef.current = resolve;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        const run = () => {
          const queryKey = queryKeyRef.current;

          const isMutating = queryClient.isMutating({
            mutationKey: queryKey,
          });

          if (isMutating !== 0) {
            timeoutRef.current = setTimeout(run, delay);
            return;
          }

          const action = async () => {
            if (!awaitFetch) {
              await queryClient.invalidateQueries({ queryKey });
              return;
            }

            await assertServerReachable();

            await queryClient.refetchQueries({ queryKey });

            const state = queryClient.getQueryState(queryKey);

            if (state?.status === "error") {
              throw state.error;
            }
          };

          action()
            .then(() => resolve())
            .catch(reject)
            .finally(() => {
              if (resolveRef.current === currentResolve) {
                resolveRef.current = null;
              }
              timeoutRef.current = null;
            });
        };

        timeoutRef.current = setTimeout(run, delay);
      });
    },
    [queryClient],
  );

  useEffect(() => {
    queryKeyRef.current = queryKey;
  }, [queryKey]);

  useEffect(() => {
    const base = baseTimeoutRef;
    const priority = priorityTimeoutRef;

    return () => {
      if (base.current) {
        clearTimeout(base.current);
      }
      if (priority.current) {
        clearTimeout(priority.current);
      }
    };
  }, []);

  return { scheduleQuerySync };
};
