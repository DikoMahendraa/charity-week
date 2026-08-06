import type { Role } from "./auth";

// ─── Permission map ──────────────────────────────────────────────────────────
// Each route prefix maps to the roles that may access it.
// Add new routes here when new pages are built.

export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  "/campaign/institutions": ["super_admin", "admin"],
  "/campaign/challenges":   ["super_admin", "admin"],
  "/campaign/pages":        ["super_admin", "admin", "fundraiser"],
  "/report/donors":         ["super_admin", "admin"],
  "/report/payments":       ["super_admin", "admin"],
  "/site/cms":              ["super_admin", "admin"],
  "/admin/users":           ["super_admin"],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true if the given role can access the given pathname. */
export function canAccess(pathname: string, role: Role): boolean {
  // Find the most-specific matching prefix
  const matchingKey = Object.keys(ROUTE_PERMISSIONS)
    .filter((key) => pathname === key || pathname.startsWith(key + "/"))
    .sort((a, b) => b.length - a.length)[0];

  if (!matchingKey) return true; // no rule → open to all
  return ROUTE_PERMISSIONS[matchingKey].includes(role);
}

/** Returns the first route the given role is allowed to visit (used for post-login redirect). */
export function defaultRouteForRole(role: Role): string {
  const firstAllowed = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    ROUTE_PERMISSIONS[route].includes(role)
  );
  return firstAllowed ?? "/unauthorized";
}
