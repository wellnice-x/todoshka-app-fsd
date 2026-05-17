import type { AuthState, AuthContextValue } from "./types";
import supabase from "@/shared/api/supabase/supabaseClient";
import {
  useState,
  useEffect,
  PropsWithChildren,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { AuthContext } from "./AuthContext";
import { setAccessToken } from "@/shared/auth/accessToken";
import { setUnauthorizedHandler } from "@/shared/auth/authBridge";
import type { Session } from "@supabase/supabase-js";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthState>({ authStatus: "init" });

  const isRefreshingRef = useRef(false);
  const wasUnauthorizedRef = useRef(false);

  const setStatus = useCallback((status: AuthState["authStatus"]) => {
    setAuthState({ authStatus: status });
  }, []);

  const handleSession = useCallback(
    (session: Session | null) => {
      if (wasUnauthorizedRef.current && !session) return;

      if (session?.access_token) {
        setAccessToken(session.access_token);
        setStatus("authenticated");
      } else {
        setAccessToken(null);
        setAuthState((prev) => {
          if (prev.authStatus === "authenticated") {
            return { authStatus: "closed" };
          }
          return { authStatus: "unauthenticated" };
        });
      }
    },
    [setStatus],
  );

  const tryRefreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error || !data.session) {
        setAccessToken(null);
        setStatus("unauthenticated");
        return;
      }

      handleSession(data.session);
    } catch {
      setAccessToken(null);
      setStatus("unauthenticated");
    } finally {
      wasUnauthorizedRef.current = false;
    }
  }, [handleSession, setStatus]);

  const handleUnauthorized = useCallback(async () => {
    if (isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    wasUnauthorizedRef.current = true;

    setAuthState((prev) => {
      if (prev.authStatus === "checking") return prev;

      return { authStatus: "checking" };
    });

    await tryRefreshSession();

    isRefreshingRef.current = false;
  }, [tryRefreshSession]);

  const authAnonymously = useCallback(async (): Promise<void> => {
    setStatus("checking");

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (data.session) {
        handleSession(data.session);

        return;
      }

      const { data: anonData, error: anonError } =
        await supabase.auth.signInAnonymously();

      if (anonError || !anonData.session) {
        throw anonError;
      }

      handleSession(anonData.session);
    } catch (error) {
      console.error("Auth init failed:", error);

      setStatus("unauthenticated");
    }
  }, [handleSession, setStatus]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSession]);

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
  }, [handleUnauthorized]);

  const value: AuthContextValue = useMemo(
    () => ({
      ...authState,
      isUncertain:
        authState.authStatus === "init" || authState.authStatus === "checking",
      isAuthenticated: authState.authStatus === "authenticated",
      authAnonymously,
    }),
    [authState, authAnonymously],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
