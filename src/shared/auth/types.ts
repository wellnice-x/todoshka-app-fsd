export type AuthState =
  | { authStatus: "init" | "checking" }
  | { authStatus: "unauthenticated" | "closed" }
  | { authStatus: "authenticated" };

export type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  isUncertain: boolean;
  pauseAuthHandling: () => void;
  resumeAuthHandling: () => void;
  authAnonymously: () => Promise<void>;
};