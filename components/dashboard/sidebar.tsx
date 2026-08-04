"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid, Zap, FileText, Users, CreditCard, Globe, UserCog, LogOut,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { ROLE_LABELS } from "@/lib/auth";

const navSections = [
  {
    title: "CAMPAIGN",
    items: [
      { href: "/campaign/institutions", label: "Institutions", icon: LayoutGrid },
      { href: "/campaign/challenges",   label: "Challenges",   icon: Zap        },
      { href: "/campaign/pages",        label: "Pages",        icon: FileText   },
    ],
  },
  {
    title: "REPORT",
    items: [
      { href: "/report/donors",   label: "Donors",   icon: Users      },
      { href: "/report/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    title: "SITE",
    items: [
      { href: "/site/cms", label: "CMS", icon: Globe },
    ],
  },
  {
    title: "ADMIN",
    items: [
      { href: "/admin/users", label: "Users", icon: UserCog },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, can, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Auto-collapse at md breakpoint (< 768px)
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => can(item.href)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className={cn(
        "flex flex-col bg-white rounded-2xl h-full shrink-0 overflow-hidden",
        "transition-[width,padding] duration-300 ease-in-out",
        collapsed ? "w-[72px] p-3" : "w-67 p-6",
      )}
    >
      {/* ── Logo + toggle ───────────────────────────────────────────── */}
      <div className={cn("flex items-center", collapsed ? "flex-col gap-2" : "justify-between gap-2")}>
        {/* Logo mark — always visible */}
        <div className={cn("flex items-center gap-2.5 min-w-0", collapsed && "justify-center")}>
          <div className="h-9 w-9 shrink-0">
            <Image src="/assets/svg/iruk-logo.svg" alt="Charity Week" width={36} height={45} />
          </div>
          {!collapsed && (
            <div className="leading-tight min-w-0">
              <p className="text-xs font-bold text-[#3C3C3B] leading-none truncate">Charity Week</p>
              <p className="text-[6px] text-[#3C3C3B] mt-0.5 leading-none">For Orphans &amp; Children in Need</p>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg transition-colors",
            "text-[#A1A1A1] hover:bg-gray-100 hover:text-[#3C3C3B]",
            collapsed ? "h-7 w-full" : "h-6 w-6",
          )}
        >
          {collapsed
            ? <ChevronRight className="h-4 w-4" />
            : <ChevronLeft  className="h-4 w-4" />
          }
        </button>
      </div>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto mt-8 space-y-5">
        {visibleSections.map((section) => (
          <div key={section.title}>
            {/* Section title — hidden when collapsed, replaced by a divider */}
            {collapsed
              ? <div className="mb-1.5 mx-1 h-px bg-gray-100" />
              : <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
                  {section.title}
                </p>
            }

            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center rounded-md px-2 py-2 text-sm font-semibold transition-colors",
                        collapsed ? "justify-center" : "gap-2",
                        isActive
                          ? "bg-[#FFF2DF] text-[#EC8900] border-r-4 border-[#EC8900]"
                          : "text-[#A1A1A1] hover:bg-gray-50 hover:text-gray-800",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#EC8900]" : "text-[#A1A1A1]")} />
                      {!collapsed && item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── User + Logout ────────────────────────────────────────────── */}
      {user && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* User info */}
          <div className={cn("flex items-center px-2 mb-3", collapsed ? "justify-center" : "gap-2.5")}>
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF2DF] text-xs font-bold text-[#EC8900]"
              title={collapsed ? `${user.name} · ${ROLE_LABELS[user.role]}` : undefined}
            >
              {user.avatarInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-[#3C3C3B]">{user.name}</p>
                <p className="truncate text-[10px] text-[#A1A1A1]">{ROLE_LABELS[user.role]}</p>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? "Log Out" : undefined}
            className={cn(
              "flex w-full items-center rounded-md px-2 py-2 text-sm font-semibold",
              "text-[#A1A1A1] transition-colors hover:bg-red-50 hover:text-red-500",
              collapsed ? "justify-center" : "gap-2",
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Log Out"}
          </button>
        </div>
      )}
    </aside>
  );
}
