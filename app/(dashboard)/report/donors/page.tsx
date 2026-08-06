"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type GiftAidStatus = "yes" | "no" | "open";
type DonorTab = "donations" | "page-created" | "per-challenge" | "institution-level";

interface Donor {
  id: string;
  reportId: string;
  date: string;
  amount: string;
  donor: string;
  comment: string;
  giftAid: GiftAidStatus;
  page: string;
  tags: string[];
}

const tabs: { key: DonorTab; label: string }[] = [
  { key: "donations", label: "Donations (line-by-line)" },
  { key: "page-created", label: "Page created" },
  { key: "per-challenge", label: "Per-challenge" },
  { key: "institution-level", label: "Institution-level" },
];

const donors: Donor[] = [
  { id: "1", reportId: "D-12991", date: "Friday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "Zakat  may this be a blessing for the orphans.", giftAid: "yes", page: "aisha-rahman", tags: ["#London", "#Universities"] },
  { id: "2", reportId: "D-12992", date: "Saturday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "CW 10K  running for a great cause!", giftAid: "yes", page: "aisha-rahman", tags: ["#Oxford", "#Universities"] },
  { id: "3", reportId: "D-12993", date: "Sunday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "Very awesome initiative, keep it up.", giftAid: "no", page: "aisha-rahman", tags: ["#Cambridge", "#Universities"] },
  { id: "4", reportId: "D-12995", date: "Sunday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "The spirit of this campaign is truly inspiring.", giftAid: "yes", page: "aisha-rahman", tags: ["#Imperial", "#Universities"] },
  { id: "5", reportId: "D-12996", date: "Sunday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "Networking for charity  love this concept.", giftAid: "yes", page: "aisha-rahman", tags: ["#UCL", "#Universities"] },
  { id: "6", reportId: "D-129917", date: "Sunday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "The world needs more events like this, thank you.", giftAid: "yes", page: "aisha-rahman", tags: ["#King's College", "#Universities"] },
  { id: "7", reportId: "D-12997", date: "Sunday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "I appreciate the effort the team has put into this.", giftAid: "no", page: "aisha-rahman", tags: ["#LSE", "#Universities"] },
  { id: "8", reportId: "D-12998", date: "Sunday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "The venue and organisation were top-notch.", giftAid: "no", page: "aisha-rahman", tags: ["#Queen Mary", "#Universities"] },
  { id: "9", reportId: "D-1299343", date: "Sunday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "I enjoyed every moment of this charity week event.", giftAid: "no", page: "aisha-rahman", tags: ["#Royal Holloway", "#Universities"] },
  { id: "10", reportId: "D-1299132", date: "Sunday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "Great food, great people, great cause  well done!", giftAid: "yes", page: "aisha-rahman", tags: ["#SOAS", "#Universities"] },
  { id: "11", reportId: "D-1299452", date: "Sunday, 13 September 2026, 9:00 PM", amount: "$25", donor: "Hamza K", comment: "Looking forward to supporting again next year.", giftAid: "yes", page: "aisha-rahman", tags: ["#City University", "#Universities"] },
];

/** Renders text truncated to a fixed width; hovering reveals the full value in a tooltip. */
function TruncatedCell({
  text,
  maxWidth = "max-w-[140px]",
  className,
}: {
  text: string;
  maxWidth?: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <span
            className={cn(
              "block truncate cursor-default",
              maxWidth,
              className
            )}
          />
        }
      >
        {text}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs break-words">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

function GiftAidBadge({ status }: { status: GiftAidStatus }) {
  if (status === "yes") {
    return (
      <span className="text-xs font-light bg-[#ECFDF3] px-2 py-0.5 rounded-full text-[#037847]">
        Yes
      </span>
    );
  }
  if (status === "open") {
    return (
      <span className="text-xs font-medium text-[#EC8900]">Open</span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-light text-red-500">
      No
    </span>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <Select defaultValue="all">
      <SelectTrigger className="h-8 gap-1 rounded-sm border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 hover:bg-gray-50 w-auto">
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

export default function DonorsPage() {
  const [activeTab, setActiveTab] = useState<DonorTab>("donations");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#161616]">Donors</h1>
        <p className="text-sm text-[#475467]">
          Create and manage automated communication journeys for your donors.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search donors"
            className="pl-9 bg-white w-full rounded-sm border border-[#D7D7D7] py-3"
          />
        </div>
        <Button className="gap-1.5 bg-[#EC8900] text-white font-bold hover:bg-[#d47800] whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-full px-4 py-0.5 text-xs font-semibold transition-colors",
              activeTab === tab.key
                ? "bg-[#EC8900] text-white border border-[#EC8900]"
                : "text-[#475467] bg-white border border-[#E5E7EB] hover:text-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect label="Date range" options={["Last 7 days", "Last 30 days", "Last 90 days", "This year"]} />
        <FilterSelect label="Region" options={["London", "Manchester", "Birmingham", "Leeds", "Indonesia"]} />
        <FilterSelect label="Institution Type" options={["Schools", "University societies", "Masjids", "Organisations"]} />
        <FilterSelect label="Institution" options={["Newton Academy", "South London School", "Greenfield University"]} />
        <FilterSelect label="Page Type" options={["Individual", "Team", "Institution"]} />
      </div>

      <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 bg-white hover:bg-white">
              <TableHead className="text-xs font-semibold text-gray-500 pl-6">Report ID</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Donor</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Comment</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Gift Aid</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Pages</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donors.map((donor) => (
              <TableRow
                key={donor.id}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <TableCell className="pl-6 py-4">
                  <Link
                    href={`/report/donors/${donor.id}`}
                    className="font-bold text-sm text-[#EC8900] hover:underline"
                  >
                    {donor.reportId}
                  </Link>
                </TableCell>

                <TableCell className="text-sm text-gray-600">
                  <TruncatedCell text={donor.date} maxWidth="max-w-[110px]" />
                </TableCell>

                <TableCell className="text-sm text-gray-600">{donor.amount}</TableCell>

                <TableCell className="text-sm text-gray-600">
                  <TruncatedCell text={donor.donor} maxWidth="max-w-[90px]" />
                </TableCell>

                <TableCell className="text-sm text-gray-500">
                  <TruncatedCell text={donor.comment} maxWidth="max-w-[130px]" />
                </TableCell>

                <TableCell>
                  <GiftAidBadge status={donor.giftAid} />
                </TableCell>

                <TableCell>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#EC8900] hover:underline"
                  >
                    <TruncatedCell text={donor.page} maxWidth="max-w-[100px]" className="text-[#EC8900]" />
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {donor.tags.map((tag) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
