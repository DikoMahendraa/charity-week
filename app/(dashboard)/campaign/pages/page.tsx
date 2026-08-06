"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ExternalLink, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type PageStatus = "live" | "flagged";

interface FundraisingPage {
  id: string;
  slug: string;
  creator: string;
  avatarColor: string;
  institution: string;
  raised: string;
  status: PageStatus;
  tags: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const pages: FundraisingPage[] = [
  { id: "1", slug: "aisha-rahman", creator: "Aisha R.", avatarColor: "bg-orange-400", institution: "Imperial ISOC", raised: "$25,000", status: "live", tags: ["#London", "#Universities"] },
  { id: "2", slug: "aisha-rahman", creator: "Benjamin T.", avatarColor: "bg-gray-700", institution: "East London Mosque", raised: "$25,000", status: "live", tags: ["#Oxford", "#Universities"] },
  { id: "3", slug: "aisha-rahman", creator: "Catherine L.", avatarColor: "bg-gray-200", institution: "Imperial ISOC", raised: "$25,000", status: "flagged", tags: ["#Cambridge", "#Universities"] },
  { id: "4", slug: "aisha-rahman", creator: "David K.", avatarColor: "bg-gray-300", institution: "Imperial ISOC", raised: "$25,000", status: "live", tags: ["#Imperial", "#Universities"] },
  { id: "5", slug: "aisha-rahman", creator: "Elena M.", avatarColor: "bg-gray-200", institution: "Imperial ISOC", raised: "$25,000", status: "live", tags: ["#UCL", "#Universities"] },
  { id: "6", slug: "aisha-rahman", creator: "Frank S.", avatarColor: "bg-gray-200", institution: "Imperial ISOC", raised: "$25,000", status: "live", tags: ["#King's College", "#Universities"] },
  { id: "7", slug: "aisha-rahman", creator: "Gina W.", avatarColor: "bg-amber-400", institution: "Imperial ISOC", raised: "$25,000", status: "flagged", tags: ["#LSE", "#Universities"] },
  { id: "8", slug: "aisha-rahman", creator: "Henry J.", avatarColor: "bg-gray-200", institution: "East London Mosque", raised: "$25,000", status: "flagged", tags: ["#Queen Mary", "#Universities"] },
  { id: "9", slug: "aisha-rahman", creator: "Isabella N.", avatarColor: "bg-amber-700", institution: "East London Mosque", raised: "$25,000", status: "flagged", tags: ["#Royal Holloway", "#Universities"] },
  { id: "10", slug: "aisha-rahman", creator: "Jason V.", avatarColor: "bg-gray-200", institution: "East London Mosque", raised: "$25,000", status: "live", tags: ["#SOAS", "#Universities"] },
  { id: "11", slug: "aisha-rahman", creator: "Katherine P.", avatarColor: "bg-gray-200", institution: "East London Mosque", raised: "$25,000", status: "live", tags: ["#City University", "#Universities"] },
];

const statusDot: Record<PageStatus, string> = {
  live: "bg-[#037847]",
  flagged: "bg-[#E11D48]",
};

const statusLabel: Record<PageStatus, string> = {
  live: "Live",
  flagged: "Flagged",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function CreatorAvatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className={cn("h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white", color)}>
      {initials}
    </div>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <Select defaultValue="all">
      <SelectTrigger className="h-8 gap-1 rounded-full border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50 w-auto">
        <span className="text-[#A1A1A1]">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" className="text-xs font-medium text-[#171717]">All</SelectItem>
        {options.map((o) => (
          <SelectItem key={o} value={o.toLowerCase()} className="text-xs font-medium text-[#171717]">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FundraisingPagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = pages.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || p.slug.toLowerCase().includes(q) || p.creator.toLowerCase().includes(q) || p.institution.toLowerCase().includes(q);
    const matchStatus = !statusFilter || statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#161616]">Fundraising Pages</h1>
        <p className="text-sm text-[#475467]">
          Create and manage automated communication journeys for your donors.
        </p>
      </div>

      {/* Search + Status + Type */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Fundraising Pages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white w-full rounded-sm border border-[#D7D7D7] py-3"
          />
        </div>

        {/* Status dropdown  right-aligned pill style */}
        <Select value={statusFilter ?? "all"} onValueChange={(v) => setStatusFilter(v === "all" ? null : v)}>
          <SelectTrigger className="h-10 gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 w-auto">
            <span className="text-gray-400 font-normal">Status:</span>
            <span className="font-semibold"><SelectValue /></span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">All</SelectItem>
            <SelectItem value="live" className="text-sm">Live</SelectItem>
            <SelectItem value="flagged" className="text-sm">Flagged</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter ?? "all"} onValueChange={(v) => setTypeFilter(v === "all" ? null : v)}>
          <SelectTrigger className="h-10 gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 w-auto">
            <span className="text-gray-400 font-normal">Type:</span>
            <span className="font-semibold"><SelectValue /></span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-sm">All</SelectItem>
            <SelectItem value="individual" className="text-sm">Individual</SelectItem>
            <SelectItem value="team" className="text-sm">Team</SelectItem>
            <SelectItem value="institution" className="text-sm">Institution</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect label="Date range" options={["Last 7 days", "Last 30 days", "Last 90 days", "This year"]} />
        <FilterSelect label="Region" options={["London", "Manchester", "Birmingham", "Leeds", "Indonesia"]} />
        <FilterSelect label="Institution Type" options={["Schools", "University societies", "Masjids", "Organisations"]} />
        <FilterSelect label="Institution" options={["Newton Academy", "South London School", "Greenfield University"]} />
        <FilterSelect label="Page Type" options={["Individual", "Team", "Institution"]} />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-white hover:bg-white">
              <TableHead className="text-xs font-semibold text-gray-500 pl-6">Pages</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Creator</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Institutions</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Raised</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((p) => (
                <TableRow key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  {/* Page slug link */}
                  <TableCell className="pl-6 py-4">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/campaign/pages/${p.id}`}
                        className="text-sm font-medium text-[#EC8900] hover:underline"
                      >
                        {p.slug}
                      </Link>
                      <a href="#" className="text-[#EC8900] hover:opacity-70">
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    </div>
                  </TableCell>

                  {/* Creator */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreatorAvatar name={p.creator} color={p.avatarColor} />
                      <span className="text-sm text-gray-700">{p.creator}</span>
                    </div>
                  </TableCell>

                  {/* Institution */}
                  <TableCell className="text-sm font-semibold text-gray-800">
                    {p.institution}
                  </TableCell>

                  {/* Raised */}
                  <TableCell className="text-sm text-gray-600">{p.raised}</TableCell>

                  {/* Status badge */}
                  <TableCell>
                    <Badge variant={p.status} className="gap-1.5 pl-2">
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusDot[p.status])} />
                      {statusLabel[p.status]}
                    </Badge>
                  </TableCell>

                  {/* Tags */}
                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-400">
                  No pages match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
