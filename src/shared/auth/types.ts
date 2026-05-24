export type AuthState =
  | { authStatus: "init" | "checking" }
  | { authStatus: "unauthenticated" | "closed" }
  | { authStatus: "authenticated" };

export type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  isUncertain: boolean;
  authAnonymously: () => Promise<void>;
};