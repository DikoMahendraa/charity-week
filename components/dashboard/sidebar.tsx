"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Zap, FileText, Users, CreditCard, Globe, UserCog,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const navSections = [
  {
    title: "CAMPAIGN",
    items: [
      { href: "/campaign/institutions", label: "Institutions", icon: LayoutGrid },
      { href: "/campaign/challenges",   label: "Challenges",   icon: Zap },
      { href: "/campaign/pages",        label: "Pages",        icon: FileText },
    ],
  },
  {
    title: "REPORT",
    items: [
      { href: "/report/donors",   label: "Donors",   icon: Users },
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
  const { can } = useAuth();

  // Filter each section's items to only those the current user may access
  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => can(item.href)),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside className="w-67 rounded-2xl p-6 flex flex-col bg-white h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9">
          <Image src="/assets/svg/iruk-logo.svg" alt="Charity Week" width={36} height={45} />
        </div>
        <div className="leading-tight">
          <p className="text-xs font-bold text-[#3C3C3B] leading-none">Charity Week</p>
          <p className="text-[6px] text-[#3C3C3B] mt-0.5 leading-none">For Orphans &amp; Children in Need</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto mt-8 space-y-5">
        {visibleSections.map((section) => (
          <div key={section.title}>
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#A1A1A1]">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-[#FFF2DF] text-[#EC8900] border-r-4 border-[#EC8900]"
                          : "text-[#A1A1A1] hover:bg-gray-50 hover:text-gray-800"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#EC8900]" : "text-[#A1A1A1]")} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

    </aside>
  );
}
