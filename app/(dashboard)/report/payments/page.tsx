"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type PaymentStatus = "completed" | "failed" | "refunded" | "abandoned" | "pending" | "renewal";

type FilterKey = "all" | PaymentStatus;

interface Payment {
  id: string;
  createdDate: string;
  donorName: string;
  avatarColor: string;
  page: string;
  amount: string;
  tipFee: string;
  paymentType: string;
  status: PaymentStatus;
}

interface FilterTab {
  key: FilterKey;
  label: string;
  count: string;
}

const filters: FilterTab[] = [
  { key: "all",       label: "All transactions", count: "10,000+" },
  { key: "completed", label: "Completed",         count: "10,000+" },
  { key: "renewal",   label: "Renewal",           count: "31" },
  { key: "pending",   label: "Pending",           count: "2" },
  { key: "failed",    label: "Failed",            count: "24" },
  { key: "refunded",  label: "Refund",            count: "51" },
  { key: "abandoned", label: "Abandoned",         count: "4" },
];

const statusDotColor: Record<PaymentStatus, string> = {
  completed: "bg-[#037847]",
  failed:    "bg-red-500",
  refunded:  "bg-red-400",
  abandoned: "bg-orange-500",
  pending:   "bg-amber-500",
  renewal:   "bg-blue-500",
};

const statusLabel: Record<PaymentStatus, string> = {
  completed: "Completed",
  failed:    "Failed",
  refunded:  "Refunded",
  abandoned: "Abandoned",
  pending:   "Pending",
  renewal:   "Renewal",
};

const payments: Payment[] = [
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Aisha R.",     avatarColor: "bg-orange-400", page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Monthly setup",    status: "completed" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Benjamin T.",  avatarColor: "bg-gray-700",   page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "One-time",          status: "completed" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Catherine L.", avatarColor: "bg-gray-300",   page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Weekly setup",      status: "failed" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "David K.",     avatarColor: "bg-blue-500",   page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Weekly recurring",  status: "completed" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Elena M.",     avatarColor: "bg-gray-400",   page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Monthly recurring", status: "completed" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Frank S.",     avatarColor: "bg-gray-400",   page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Recurring",         status: "completed" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Gina W.",      avatarColor: "bg-amber-400",  page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Recurring",         status: "refunded" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Henry J.",     avatarColor: "bg-gray-300",   page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Recurring",         status: "refunded" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Isabella N.",  avatarColor: "bg-amber-700",  page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Recurring",         status: "failed" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Jason V.",     avatarColor: "bg-gray-400",   page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Recurring",         status: "abandoned" },
  { id: "ID-12131", createdDate: "Fri. 13 Sept..", donorName: "Katherine P.", avatarColor: "bg-gray-300",   page: "aisha-rahman", amount: "£1,200", tipFee: "£120", paymentType: "Recurring",         status: "pending" },
];

function DonorAvatar({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className={cn("h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white", color)}>
      {initials}
    </div>
  );
}

export default function PaymentsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery]   = useState("");

  const filtered = payments.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.status === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.id.toLowerCase().includes(q) ||
      p.donorName.toLowerCase().includes(q) ||
      p.page.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#161616]">Payments</h1>
        <p className="text-sm text-[#475467]">
          Create and manage automated communication journeys for your donors.
        </p>
      </div>

      {/* Search + Export */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search payments by ID, name, or email."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white w-full rounded-sm border border-[#D7D7D7] py-3"
          />
        </div>
        <Button className="gap-1.5 bg-[#EC8900] text-white font-bold hover:bg-[#d47800] whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Export CSV
        </Button>
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
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-7 gap-3">
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
              "text-lg font-bold",
              activeFilter === f.key ? "text-[#EC8900]" : "text-gray-800"
            )}>
              {f.count}
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
              <TableHead className="text-xs font-semibold text-gray-500">Created Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Donor name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Pages</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Tip/fee</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Payment type</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((p, i) => (
                <TableRow key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <TableCell className="pl-6 py-4">
                    <Link
                      href={`/report/payments/${i + 1}`}
                      className="font-bold text-sm text-[#EC8900] hover:underline"
                    >
                      {p.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 whitespace-nowrap">
                    {p.createdDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DonorAvatar name={p.donorName} color={p.avatarColor} />
                      <span className="text-sm text-gray-700">{p.donorName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#EC8900] hover:underline"
                    >
                      {p.page}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-gray-800">{p.amount}</TableCell>
                  <TableCell className="text-sm text-gray-600">{p.tipFee}</TableCell>
                  <TableCell className="text-sm text-gray-600">{p.paymentType}</TableCell>
                  <TableCell>
                    <Badge variant={p.status} className="gap-1.5 pl-2">
                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusDotColor[p.status])} />
                      {statusLabel[p.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-sm text-gray-400">
                  No payments match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
