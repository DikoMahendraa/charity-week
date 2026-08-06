import Link           from "next/link";
import { notFound }  from "next/navigation";
import { ArrowLeft, Upload } from "lucide-react";
import { Button }    from "@/components/ui/button";
import { AddInstitutionDialog }  from "@/components/dashboard/add-institution-dialog";
import { EditInstitutionDialog } from "@/components/dashboard/edit-institution-dialog";

/* ── Types ───────────────────────────────────────────────────── */
type InstitutionStatus = "invited" | "live" | "exit" | "funded";

interface Activity {
  id:     number;
  date:   string;
  label:  string;
  value:  string;
  type:   "amount" | "badge";
}

interface InstitutionDetail {
  id:             string;
  displayName:    string;
  name:           string;
  type:           string;
  region:         string;
  status:         InstitutionStatus;
  submittedBy:    string;
  dateRegistered: string;
  totalDonors:    number;
  donorsTrend:    string;
  activeChallenges: number;
  challengesTrend:  string;
  totalRaised:    string;
  raisedTrend:    string;
  recentActivity: Activity[];
}

/* ── Static data ─────────────────────────────────────────────── */
const INSTITUTIONS: Record<string, InstitutionDetail> = {
  "1": {
    id:             "1",
    displayName:    "East Mosque London",
    name:           "Newton Academy",
    type:           "Schools",
    region:         "Indonesia",
    status:         "live",
    submittedBy:    "a registrant",
    dateRegistered: "15 March 2024",
    totalDonors:    245,
    donorsTrend:    "+12.5% this month",
    activeChallenges: 12,
    challengesTrend: "3 ending soon",
    totalRaised:    "$52,400",
    raisedTrend:    "+$4,200 this week",
    recentActivity: [
      { id: 1, date: "15 Mar 2024", label: "Donor #4812 donated to clean water campaign",          value: "$250.00",   type: "amount" },
      { id: 2, date: "12 Mar 2024", label: "Newton Academy joined Islamic Relief Winter Campaign",  value: "Joined",    type: "badge"  },
      { id: 3, date: "10 Mar 2024", label: "Donor #5012 set up monthly recurring donation",        value: "$15.00/mo", type: "amount" },
    ],
  },
  "2": {
    id:             "2",
    displayName:    "Madinah University Society",
    name:           "Newton Academy",
    type:           "University societies",
    region:         "Indonesia",
    status:         "live",
    submittedBy:    "a registrant",
    dateRegistered: "10 February 2024",
    totalDonors:    182,
    donorsTrend:    "+8.3% this month",
    activeChallenges: 5,
    challengesTrend: "1 ending soon",
    totalRaised:    "$34,700",
    raisedTrend:    "+$2,100 this week",
    recentActivity: [
      { id: 1, date: "14 Mar 2024", label: "Donor #3021 donated to food parcel campaign",   value: "$100.00", type: "amount" },
      { id: 2, date: "11 Mar 2024", label: "Society updated their fundraising goal",         value: "Updated", type: "badge"  },
    ],
  },
};

function getInstitution(id: string): InstitutionDetail | null {
  return INSTITUTIONS[id] ?? INSTITUTIONS["1"]; // fallback to first for unknown IDs
}

/* ── Status helpers ──────────────────────────────────────────── */
const STATUS_LABEL: Record<InstitutionStatus, string> = {
  invited: "Invited", live: "Live", exit: "Exit", funded: "Funded",
};

const STATUS_COLOR: Record<InstitutionStatus, string> = {
  live:    "text-[#14BA6D]",
  invited: "text-gray-500",
  exit:    "text-red-500",
  funded:  "text-blue-700",
};

const STATUS_DOT: Record<InstitutionStatus, string> = {
  live:    "bg-[#14BA6D]",
  invited: "bg-gray-400",
  exit:    "bg-red-500",
  funded:  "bg-blue-700",
};

/* ── Stat card ───────────────────────────────────────────────── */
function StatCard({
  label, value, trend, trendColor,
}: {
  label: string; value: string | number; trend: string; trendColor: string;
}) {
  return (
    <div className="flex-1 rounded-xl border border-gray-100 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-gray-900">{value}</span>
        <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>
      </div>
    </div>
  );
}

/* ── Profile row ─────────────────────────────────────────────── */
function ProfileRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold text-gray-900">{children}</span>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
interface Props {
  params: Promise<{ id: string }>;
}

export default async function InstitutionDetailPage({ params }: Props) {
  const { id } = await params;
  const inst   = getInstitution(id);
  if (!inst) notFound();

  return (
    <div className="space-y-6">

      {/* Breadcrumb + Back */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/campaign/institutions"
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Institutions</span>
        </Link>
        <span className="text-gray-300">&rsaquo;</span>
        <span className="font-semibold text-[#EC8900]">{inst.displayName}</span>
      </div>

      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#161616]">{inst.displayName}</h1>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${STATUS_DOT[inst.status]}`} />
              <span className={`text-sm font-semibold ${STATUS_COLOR[inst.status]}`}>
                {STATUS_LABEL[inst.status]}
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-400">submitted by {inst.submittedBy}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 border-[#EC8900] text-[#EC8900] hover:bg-orange-50 font-semibold"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <EditInstitutionDialog
            institutionName={inst.name}
            institutionType={inst.type}
            region={inst.region}
          />
          <AddInstitutionDialog />
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex gap-4">
        <StatCard
          label="Total Donors"
          value={inst.totalDonors}
          trend={inst.donorsTrend}
          trendColor="text-[#14BA6D]"
        />
        <StatCard
          label="Active Challenges"
          value={inst.activeChallenges}
          trend={inst.challengesTrend}
          trendColor="text-[#EC8900]"
        />
        <StatCard
          label="Total Raised"
          value={inst.totalRaised}
          trend={inst.raisedTrend}
          trendColor="text-[#14BA6D]"
        />
      </div>

      {/* Two-column content */}
      <div className="grid gap-4 lg:grid-cols-[5fr_4fr]">

        {/* Profile & Overview */}
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="text-base font-bold text-gray-900">Institution Profile &amp; Overview</h2>
          <div className="mt-4 divide-y divide-gray-50">
            <ProfileRow label="Institution Name">{inst.name}</ProfileRow>
            <ProfileRow label="Type">{inst.type}</ProfileRow>
            <ProfileRow label="Region">{inst.region}</ProfileRow>
            <ProfileRow label="Status">
              <span className={`flex items-center gap-1.5 ${STATUS_COLOR[inst.status]}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[inst.status]}`} />
                {STATUS_LABEL[inst.status]}
              </span>
            </ProfileRow>
            <ProfileRow label="Submitted by">{inst.submittedBy}</ProfileRow>
            <ProfileRow label="Date Registered">{inst.dateRegistered}</ProfileRow>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-100 bg-white p-6">
          <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
          <div className="mt-4 flex flex-col gap-3">
            {inst.recentActivity.map(activity => (
              <div
                key={activity.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{activity.date}</span>
                  {activity.type === "amount" ? (
                    <span className="text-sm font-bold text-[#14BA6D]">{activity.value}</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-800">{activity.value}</span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-gray-700">{activity.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
