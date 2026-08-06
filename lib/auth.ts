// ─── Role types ──────────────────────────────────────────────────────────────

export type Role = "super_admin" | "admin" | "fundraiser";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarInitials: string;
}

// ─── Role metadata (display labels etc.) ────────────────────────────────────

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin:       "Admin",
  fundraiser:  "Fundraiser",
};

// ─── Mock user ───────────────────────────────────────────────────────────────
// Replace the body of getCurrentUser() with a real session fetch (e.g.
// getServerSession(), supabase.auth.getUser(), or a JWT decode) when the
// auth API is ready. Nothing else in the codebase needs to change.

export const MOCK_USERS: Record<Role, AuthUser> = {
  super_admin: {
    id: "1",
    name: "Diko Mahendra",
    email: "diko@amanahfy.com",
    role: "super_admin",
    avatarInitials: "DM",
  },
  admin: {
    id: "2",
    name: "Adil Rahman",
    email: "adil@amanahfy.com",
    role: "admin",
    avatarInitials: "AR",
  },
  fundraiser: {
    id: "3",
    name: "Aissha Fatmawati",
    email: "aissha@gmail.com",
    role: "fundraiser",
    avatarInitials: "AF",
  },
};
