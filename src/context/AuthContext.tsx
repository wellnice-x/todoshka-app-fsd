import { createContext } from "react";

export type AuthState =
  | { authStatus: "init" | "checking" }
  | { authStatus: "unauthenticated" | "closed" }
  | { authStatus: "authenticated" };

export type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  isUncertain: boolean;
  authAnonymously: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
