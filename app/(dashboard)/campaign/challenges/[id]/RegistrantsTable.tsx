"use client";

import { useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RegStatus = "approved" | "pending" | "failed";

interface Registrant {
  id:               string;
  name:             string;
  initials:         string;
  avatarColor:      string;
  avatarBg:         string;
  email:            string;
  registrationDate: string;
  status:           RegStatus;
}

const REGISTRANTS: Registrant[] = [
  { id: "1", name: "Amina Saaed",  initials: "AS", avatarColor: "text-rose-600",   avatarBg: "bg-rose-100",   email: "james.t@charityweek.org",   registrationDate: "Fri, 25 Sept 2026, 9:00 PM", status: "approved" },
  { id: "2", name: "Fauzan",       initials: "F",  avatarColor: "text-sky-600",    avatarBg: "bg-sky-100",    email: "sarah.k@charityweek.org",   registrationDate: "Fri, 25 Sept 2026, 9:00 PM", status: "approved" },
  { id: "3", name: "Diko",         initials: "D",  avatarColor: "text-violet-600", avatarBg: "bg-violet-100", email: "michael.b@charityweek.org", registrationDate: "Fri, 25 Sept 2026, 9:00 PM", status: "approved" },
  { id: "4", name: "Naufal",       initials: "N",  avatarColor: "text-amber-600",  avatarBg: "bg-amber-100",  email: "linda.r@charityweek.org",   registrationDate: "Fri, 25 Sept 2026, 9:00 PM", status: "failed"   },
  { id: "5", name: "Yasmine",      initials: "Y",  avatarColor: "text-teal-600",   avatarBg: "bg-teal-100",   email: "david.m@charityweek.org",   registrationDate: "Fri, 25 Sept 2026, 9:00 PM", status: "pending"  },
];

const STATUS_STYLE: Record<RegStatus, string> = {
  approved: "bg-[#ECFDF3] text-[#037847]",
  pending:  "bg-[#FFF9EC] text-[#B45309]",
  failed:   "bg-[#FDECEC] text-[#EF4444]",
};

const STATUS_LABEL: Record<RegStatus, string> = {
  approved: "Approved",
  pending:  "Pending",
  failed:   "Failed",
};

type TabFilter = "all" | RegStatus;

// ─── Review Dialog ────────────────────────────────────────────────────────────

const ACTION_OPTIONS = ["Approve", "Reject", "Pending"];

function ReviewDialog({
  registrant,
  open,
  onClose,
  onSubmit,
}: {
  registrant: Registrant;
  open:       boolean;
  onClose:    () => void;
  onSubmit:   (action: string) => void;
}) {
  const [action, setAction] = useState("Approve");

  function handleSubmit() {
    onSubmit(action);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={val => { if (!val) onClose(); }}>
      <DialogContent showCloseButton={false} className="sm:max-w-md gap-0 px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <DialogTitle className="text-xl font-bold text-gray-900">Review</DialogTitle>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-t border-gray-100 pt-5 space-y-5">

          {/* Registrant Information */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-900">Registrant Information</p>

            <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm">
              {/* Avatar + name + email */}
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${registrant.avatarBg} ${registrant.avatarColor}`}>
                  {registrant.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{registrant.name}</p>
                  <p className="text-xs text-gray-400">{registrant.email}</p>
                </div>
              </div>

              {/* Registration date */}
              <div className="text-right">
                <p className="text-xs font-medium text-gray-400">Registration Date</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-700">{registrant.registrationDate}</p>
              </div>
            </div>
          </div>

          {/* Action select */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Action</label>
            <div className="relative">
              <select
                value={action}
                onChange={e => setAction(e.target.value)}
                className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-700 outline-none focus:border-[#EC8900] focus:ring-1 focus:ring-[#EC8900]/30 transition-colors cursor-pointer"
              >
                {ACTION_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="w-full h-12 rounded-xl bg-[#EC8900] text-sm font-bold text-white hover:bg-[#d47800]"
          >
            Submit
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}

// ─── Registrants Table ────────────────────────────────────────────────────────

export function RegistrantsTable({ total }: { total: number }) {
  const [tab,      setTab]      = useState<TabFilter>("all");
  const [selected, setSelected] = useState<Registrant | null>(null);
  const [statuses, setStatuses] = useState<Record<string, RegStatus>>(
    Object.fromEntries(REGISTRANTS.map(r => [r.id, r.status]))
  );

  const filtered =
    tab === "all" ? REGISTRANTS : REGISTRANTS.filter(r => statuses[r.id] === tab);

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "all",      label: "All"      },
    { key: "approved", label: "Approved" },
    { key: "pending",  label: "Pending"  },
    { key: "failed",   label: "Failed"   },
  ];

  function handleSubmit(action: string) {
    if (!selected) return;
    const map: Record<string, RegStatus> = {
      "Approve": "approved",
      "Reject":  "failed",
      "Pending": "pending",
    };
    const next = map[action];
    if (next) setStatuses(prev => ({ ...prev, [selected.id]: next }));
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white">
      {/* Section header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-gray-900">Recent Registrants</h2>
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
            {total}
          </span>
        </div>
        <button className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors">
          <Search className="h-3.5 w-3.5" />
          Find campaign
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-6 pb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              tab === t.key
                ? "bg-[#EC8900] text-white"
                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-100 bg-white hover:bg-white">
            <TableHead className="text-xs font-semibold text-gray-500 pl-6">Name</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500">Email</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500">Registration Date</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500">Status</TableHead>
            <TableHead className="text-xs font-semibold text-gray-500 text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(reg => {
            const currentStatus = statuses[reg.id] ?? reg.status;
            return (
              <TableRow key={reg.id} className="border-b border-gray-50 hover:bg-gray-50">
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${reg.avatarBg} ${reg.avatarColor}`}>
                      {reg.initials}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{reg.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">{reg.email}</TableCell>
                <TableCell className="text-sm text-gray-500 whitespace-nowrap">{reg.registrationDate}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[currentStatus]}`}>
                    {STATUS_LABEL[currentStatus]}
                  </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelected(reg)}
                    className="rounded-full border-[#EC8900] px-4 text-[#EC8900] hover:bg-orange-50 hover:border-orange-300"
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Review dialog */}
      {selected && (
        <ReviewDialog
          registrant={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
