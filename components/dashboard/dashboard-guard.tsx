"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { defaultRouteForRole } from "@/lib/permissions";

// Sits inside the dashboard layout, checks the current path against the
// current user's role on every navigation, and redirects if access is denied.
export function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, can } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.replace("/unauthorized"); return; }
    if (!can(pathname)) {
      // Send the user to their default allowed route instead of a dead end
      const fallback = defaultRouteForRole(user.role);
      router.replace(pathname === fallback ? "/unauthorized" : fallback);
    }
  }, [isLoading, user, pathname, can, router]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#EC8900] border-t-transparent" />
      </div>
    );
  }

  // While a redirect is pending, render nothing
  if (!user || !can(pathname)) return null;

  return <>{children}</>;
}
