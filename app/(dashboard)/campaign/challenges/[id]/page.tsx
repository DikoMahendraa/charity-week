import Link               from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Button }          from "@/components/ui/button";
import { Input }           from "@/components/ui/input";
import { Search }          from "lucide-react";
import { EditChallengeDialog } from "@/components/dashboard/edit-challenge-dialog";
import { RegistrantsTable }    from "./RegistrantsTable";

/* ── Types ───────────────────────────────────────────────────── */
interface ChallengeDetail {
  id:            string;
  name:          string;
  price:         string;
  totalTickets:  string;
  capacity:      number;
  registrations: number;
  createdBy:     string;
  createdByInitials: string;
  createdDate:   string;
  dateOfEvent:   string;
  status:        string;
  totalRegistrants: number;
}

/* ── Static data ─────────────────────────────────────────────── */
const CHALLENGES: Record<string, ChallengeDetail> = {
  "1": {
    id:            "1",
    name:          "CW 10K Run",
    price:         "$15",
    totalTickets:  "$12,225",
    capacity:      127,
    registrations: 17,
    createdBy:     "Layla Haddad",
    createdByInitials: "LH",
    createdDate:   "Fri, 13 Sept 2026, 9:00 PM",
    dateOfEvent:   "Fri, 25 Sept 2026, 9:00 PM",
    status:        "Open for public entries",
    totalRegistrants: 291,
  },
  "2": {
    id:            "2",
    name:          "CW Cycling Challenge",
    price:         "$25",
    totalTickets:  "$9,750",
    capacity:      117,
    registrations: 105,
    createdBy:     "Omar Al-Farouq",
    createdByInitials: "OA",
    createdDate:   "Fri, 13 Sept 2026, 9:00 PM",
    dateOfEvent:   "Fri, 25 Sept 2026, 9:00 PM",
    status:        "Limited spots",
    totalRegistrants: 105,
  },
};

function getChallenge(id: string): ChallengeDetail {
  return CHALLENGES[id] ?? CHALLENGES["1"];
}

/* ── Stat card ───────────────────────────────────────────────── */
function StatCard({
  label, value, suffix,
}: {
  label: string; value: string; suffix?: string;
}) {
  return (
    <div className="flex-1 rounded-xl border border-gray-100 bg-white p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold text-gray-900">{value}</span>
        {suffix && <span className="text-sm font-medium text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeDetailPage({ params }: Props) {
  const { id } = await params;
  const ch     = getChallenge(id);

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/campaign/challenges"
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Challenge</span>
        </Link>
        <span className="text-gray-300">&rsaquo;</span>
        <span className="font-semibold text-[#EC8900]">Challenge Detail Page</span>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#161616]">{ch.name}</h1>
        <p className="mt-1 text-sm text-gray-400">
          Design and oversee automated communication paths for your donors.
        </p>
      </div>

      {/* Search + actions */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search challenge information"
            className="pl-9 bg-white w-full rounded-sm border border-[#D7D7D7] py-3"
          />
        </div>
        <EditChallengeDialog
          challengeName={ch.name}
          initialPrice={ch.price.replace("$", "")}
          triggerLabel="Edit Page"
          triggerVariant="outline"
          triggerClassName="border-[#EC8900] text-[#EC8900] hover:bg-orange-50 font-semibold whitespace-nowrap px-5"
        />
        <Button className="gap-1.5 bg-[#EC8900] text-white font-bold hover:bg-[#d47800] whitespace-nowrap">
          <Plus className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stat cards */}
      <div className="flex gap-4">
        <StatCard label="Price"         value={ch.price} />
        <StatCard label="Total tickets" value={ch.totalTickets} />
        <StatCard label="Capacity"      value={ch.capacity.toString()} suffix="Total Seats" />
        <StatCard
          label="Registrations"
          value={ch.registrations.toString()}
          suffix={`of ${ch.capacity} Seats`}
        />
      </div>

      {/* Challenge Information */}
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <h2 className="text-base font-bold text-gray-900">Challenge Information</h2>
        <div className="mt-5 grid grid-cols-4 gap-6">

          {/* Created By */}
          <div>
            <p className="text-xs text-gray-400">Created By</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-400 text-xs font-bold text-white">
                {ch.createdByInitials}
              </div>
              <span className="text-sm font-semibold text-gray-900">{ch.createdBy}</span>
            </div>
          </div>

          {/* Created Date */}
          <div>
            <p className="text-xs text-gray-400">Created Date</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{ch.createdDate}</p>
          </div>

          {/* Date of Event */}
          <div>
            <p className="text-xs text-gray-400">Date of Event</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{ch.dateOfEvent}</p>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs text-gray-400">Status</p>
            <p className="mt-2 text-sm font-semibold text-[#14BA6D]">{ch.status}</p>
          </div>

        </div>
      </div>

      {/* Recent Registrants */}
      <RegistrantsTable total={ch.totalRegistrants} />

    </div>
  );
}
