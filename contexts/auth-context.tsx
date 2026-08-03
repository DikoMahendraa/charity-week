"use client";

import {
  createContext, useContext, useEffect, useState, useCallback,
} from "react";
import type { AuthUser, Role } from "@/lib/auth";
import { MOCK_USERS } from "@/lib/auth";
import { canAccess } from "@/lib/permissions";

// ─── Context shape ────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  /** Check if current user may visit a route. */
  can: (pathname: string) => boolean;
  /** Dev-only: switch the active mock role. Remove once real auth is wired. */
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "iruk_dev_role";
const DEFAULT_ROLE: Role = "super_admin";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, read persisted mock role from localStorage (dev only).
  // Replace this block with a real session fetch when the API is ready:
  //   const session = await getSession();
  //   setUser(session?.user ?? null);
  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Role | null) ?? DEFAULT_ROLE;
    setUser(MOCK_USERS[stored] ?? MOCK_USERS[DEFAULT_ROLE]);
    setIsLoading(false);
  }, []);

  const switchRole = useCallback((role: Role) => {
    localStorage.setItem(STORAGE_KEY, role);
    setUser(MOCK_USERS[role]);
  }, []);

  const can = useCallback(
    (pathname: string) => (user ? canAccess(pathname, user.role) : false),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, can, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
