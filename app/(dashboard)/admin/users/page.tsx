"use client";

import { useState } from "react";
import { Search, Plus, MoreHorizontal, UserPlus, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ROLE_LABELS, type Role } from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

type UserStatus = "active" | "pending" | "suspended";
type FilterKey = "all" | UserStatus;

interface User {
  id: string;
  joinedDate: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  role: Role;
  status: UserStatus;
  lastActive: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const USERS: User[] = [
  { id: "USR-001", joinedDate: "Mon. 1 Jan.", name: "Diko Mahendra", email: "diko@amanahfy.com", initials: "DM", avatarColor: "bg-orange-500", role: "super_admin", status: "active", lastActive: "Today" },
  { id: "USR-002", joinedDate: "Tue. 14 Feb.", name: "Adil Rahman", email: "adil@amanahfy.com", initials: "AR", avatarColor: "bg-blue-500", role: "admin", status: "active", lastActive: "2 hours ago" },
  { id: "USR-003", joinedDate: "Wed. 8 Mar.", name: "Aissha Fatmawati", email: "aissha@gmail.com", initials: "AF", avatarColor: "bg-purple-500", role: "fundraiser", status: "active", lastActive: "Yesterday" },
  { id: "USR-004", joinedDate: "Thu. 6 Apr.", name: "Bilal Yusuf", email: "bilal@iruk.org", initials: "BY", avatarColor: "bg-teal-500", role: "admin", status: "active", lastActive: "3 days ago" },
  { id: "USR-005", joinedDate: "Fri. 12 May", name: "Fatima Noor", email: "fatima@iruk.org", initials: "FN", avatarColor: "bg-pink-500", role: "fundraiser", status: "active", lastActive: "1 week ago" },
  { id: "USR-006", joinedDate: "Sat. 3 Jun.", name: "Hassan Malik", email: "hassan@iruk.org", initials: "HM", avatarColor: "bg-green-600", role: "fundraiser", status: "pending", lastActive: "" },
  { id: "USR-007", joinedDate: "Sun. 9 Jul.", name: "Imaan Hussain", email: "imaan@charity.org", initials: "IH", avatarColor: "bg-indigo-500", role: "admin", status: "pending", lastActive: "" },
  { id: "USR-008", joinedDate: "Mon. 7 Aug.", name: "Jasmine Kaur", email: "jasmine@charity.org", initials: "JK", avatarColor: "bg-rose-500", role: "fundraiser", status: "pending", lastActive: "" },
  { id: "USR-009", joinedDate: "Tue. 5 Sept.", name: "Khalid Omar", email: "khalid@gmail.com", initials: "KO", avatarColor: "bg-amber-600", role: "fundraiser", status: "suspended", lastActive: "2 weeks ago" },
  { id: "USR-010", joinedDate: "Wed. 11 Oct.", name: "Layla Abdulaziz", email: "layla@amanahfy.com", initials: "LA", avatarColor: "bg-cyan-600", role: "admin", status: "suspended", lastActive: "1 month ago" },
  { id: "USR-011", joinedDate: "Thu. 2 Nov.", name: "Mustafa Ibrahim", email: "mustafa@iruk.org", initials: "MI", avatarColor: "bg-lime-600", role: "fundraiser", status: "active", lastActive: "4 days ago" },
  { id: "USR-012", joinedDate: "Fri. 8 Dec.", name: "Nadia Rashid", email: "nadia@iruk.org", initials: "NR", avatarColor: "bg-fuchsia-500", role: "fundraiser", status: "active", lastActive: "6 hours ago" },
];

// ─── Filters ──────────────────────────────────────────────────────────────────

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All users" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "suspended", label: "Suspended" },
];

function countByStatus(status: UserStatus) {
  return USERS.filter((u) => u.status === status).length;
}

const statCounts: Record<FilterKey, number | string> = {
  all: USERS.length,
  active: countByStatus("active"),
  pending: countByStatus("pending"),
  suspended: countByStatus("suspended"),
};

// ─── Badge + role helpers ─────────────────────────────────────────────────────

const statusBadge: Record<UserStatus, { variant: "live" | "invited" | "exit"; label: string }> = {
  active: { variant: "live", label: "Active" },
  pending: { variant: "invited", label: "Pending" },
  suspended: { variant: "exit", label: "Suspended" },
};

const statusDot: Record<UserStatus, string> = {
  active: "bg-[#037847]",
  pending: "bg-gray-400",
  suspended: "bg-red-500",
};

const rolePillColor: Record<Role, string> = {
  super_admin: "bg-orange-50  text-orange-700  border-orange-200",
  admin: "bg-blue-50    text-blue-700    border-blue-200",
  fundraiser: "bg-purple-50  text-purple-700  border-purple-200",
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

function UserAvatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={cn("h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white", color)}>
      {initials}
    </div>
  );
}

// ─── Invite modal ─────────────────────────────────────────────────────────────

function InviteModal() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("fundraiser");
  const [name, setName] = useState("");

  const handleSend = () => {
    console.log("[Users] Invite payload →", { name, email, role });
    setName("");
    setEmail("");
    setRole("fundraiser");
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="gap-1.5 bg-[#EC8900] text-white font-bold hover:bg-[#d47800] whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Invite User
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 mb-1">
            <UserPlus className="h-5 w-5 text-[#EC8900]" />
          </div>
          <DialogTitle className="text-base font-bold text-[#161616]">Invite a new user</DialogTitle>
          <p className="text-xs text-[#475467]">{`They'll`} receive an email to set up their account.</p>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#3C3C3B]">Full Name</label>
            <Input
              placeholder="e.g. Aisha Rahman"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border-[#D7D7D7] text-sm"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#3C3C3B]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-white border-[#D7D7D7] text-sm"
              />
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#3C3C3B]">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-md border border-[#D7D7D7] bg-white px-3 py-2 text-sm text-[#3C3C3B] focus:border-[#EC8900] focus:outline-none focus:ring-1 focus:ring-[#EC8900]"
            >
              {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="mt-2 bg-transparent border-0 px-0 pb-0">
          <DialogClose
            render={
              <Button variant="outline" className="flex-1 text-sm font-semibold text-[#475467]">
                Cancel
              </Button>
            }
          />
          <DialogClose
            render={
              <Button
                onClick={handleSend}
                disabled={!email.trim()}
                className="flex-1 bg-[#EC8900] text-white font-bold hover:bg-[#d47800] text-sm"
              >
                Send Invite
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row actions menu ─────────────────────────────────────────────────────────

function RowActions({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 min-w-[140px] rounded-lg border border-gray-100 bg-white py-1 shadow-lg">
            <button
              onClick={() => { console.log("[Users] Edit →", user.id); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Edit user
            </button>
            {user.status === "active" ? (
              <button
                onClick={() => { console.log("[Users] Suspend →", user.id); setOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-50"
              >
                Suspend
              </button>
            ) : user.status === "suspended" ? (
              <button
                onClick={() => { console.log("[Users] Reactivate →", user.id); setOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50"
              >
                Reactivate
              </button>
            ) : null}
            <div className="my-1 h-px bg-gray-100" />
            <button
              onClick={() => { console.log("[Users] Remove →", user.id); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50"
            >
              Remove user
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = USERS.filter((u) => {
    const matchesFilter = activeFilter === "all" || u.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.id.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      ROLE_LABELS[u.role].toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#161616]">Users</h1>
        <p className="text-sm text-[#475467]">Create and manage users for access.</p>
      </div>

      {/* Search + Invite */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name, email or role…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white w-full rounded-sm border border-[#D7D7D7] py-3"
          />
        </div>
        <InviteModal />
      </div>

      {/* Tab pills */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors border",
              activeFilter === f.key
                ? "bg-[#EC8900] text-white border-[#EC8900]"
                : "bg-white text-[#475467] border-[#E5E7EB] hover:text-gray-700"
            )}
          >
            {f.label} ({statCounts[f.key]})
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={cn(
              "rounded-xl border p-4 text-left transition-colors hover:border-[#EC8900]/40",
              activeFilter === f.key
                ? "border-[#EC8900] bg-orange-50/60"
                : "border-gray-100 bg-white"
            )}
          >
            <p className={cn(
              "text-xs font-semibold mb-1 leading-tight",
              activeFilter === f.key ? "text-[#EC8900]" : "text-gray-500"
            )}>
              {f.label}
            </p>
            <p className={cn(
              "text-2xl font-bold",
              activeFilter === f.key ? "text-[#EC8900]" : "text-gray-800"
            )}>
              {statCounts[f.key]}
            </p>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-white hover:bg-white">
              <TableHead className="text-xs font-semibold text-gray-500 pl-6">ID</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Joined Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Email</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Role</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Last Active</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((user) => {
                const badge = statusBadge[user.status];
                return (
                  <TableRow key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                    {/* ID */}
                    <TableCell className="pl-6 py-4">
                      <span className="font-bold text-sm text-[#EC8900]">{user.id}</span>
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                      {user.joinedDate}
                    </TableCell>

                    {/* Name + avatar */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar initials={user.initials} color={user.avatarColor} />
                        <span className="text-sm font-medium text-gray-800">{user.name}</span>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="text-sm text-gray-500">{user.email}</TableCell>

                    {/* Role */}
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        rolePillColor[user.role]
                      )}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </TableCell>

                    {/* Last active */}
                    <TableCell className="text-sm text-gray-400">{user.lastActive}</TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant={badge.variant} className="gap-1.5 pl-2">
                        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusDot[user.status])} />
                        {badge.label}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-4">
                      <RowActions user={user} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-gray-400">
                  No users match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
