"use client";

import { useAuth } from "@/contexts/auth-context";
import { ROLE_LABELS, type Role } from "@/lib/auth";

const ROLES: Role[] = ["super_admin", "admin", "fundraiser"];

// Dev-only component  remove or guard behind process.env.NODE_ENV check
// before shipping to production.
export function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  if (!user) return null;

  return (
    <div className="mt-auto pt-4 border-t border-gray-100">
      <p className="px-2 mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
        Dev · Switch Role
      </p>
      <div className="space-y-0.5">
        {ROLES.map((role) => (
          <button
            key={role}
            onClick={() => switchRole(role)}
            className={`w-full text-left rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${user.role === role
              ? "bg-[#FFF2DF] text-[#EC8900]"
              : "text-[#A1A1A1] hover:bg-gray-50 hover:text-gray-700"
              }`}
          >
            {user.role === role && <span className="mr-1">✓</span>}
            {ROLE_LABELS[role]}
          </button>
        ))}
      </div>
      <div className="mt-3 px-2 py-2 rounded-md bg-gray-50">
        <p className="text-[10px] text-gray-400 leading-tight">
          Logged in as <span className="font-semibold text-gray-600">{user.name}</span>
          <br />
          <span className="text-[#EC8900]">{ROLE_LABELS[user.role]}</span>
        </p>
      </div>
    </div>
  );
}
