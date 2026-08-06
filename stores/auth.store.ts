import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/lib/auth";

// Persisted to localStorage under "iruk-auth".
// The axios client reads the token from this store (see lib/api/client.ts).
// When real auth is wired, call setToken(response.token) + setUser(response.user)
// after a successful login, and call logout() on sign-out.

interface AuthState {
  user:  AuthUser | null;
  token: string | null;

  setUser:  (user: AuthUser | null)  => void;
  setToken: (token: string | null)   => void;
  logout:   ()                       => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:     null,
      token:    null,
      setUser:  (user)  => set({ user }),
      setToken: (token) => set({ token }),
      logout:   ()      => set({ user: null, token: null }),
    }),
    { name: "iruk-auth" }
  )
);
