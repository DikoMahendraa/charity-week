"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, ExternalLink, MoreVertical, GripVertical, Archive, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

interface Campaign {
  id: string;
  rank: number;
  title: string;
  raised: number;
  goal: number;
  raisedFormatted: string;
  enabled: boolean;
}

// raised/goal drive the progress bar automatically.
// Replace with API data when ready — rank auto-updates after each drag.
const initialCampaigns: Campaign[] = [
  { id: "1",  rank: 1,  title: "Muslim Charity Run 2025", raised: 42500, goal: 50000, raisedFormatted: "$42,500", enabled: true  },
  { id: "2",  rank: 2,  title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$12,092", enabled: false },
  { id: "3",  rank: 3,  title: "Muslim Charity Run 2026", raised: 31750, goal: 50000, raisedFormatted: "$31,750", enabled: true  },
  { id: "4",  rank: 4,  title: "Muslim Charity Run 2026", raised:  8400, goal: 50000, raisedFormatted: "$8,400",  enabled: false },
  { id: "5",  rank: 5,  title: "Muslim Charity Run 2026", raised: 49200, goal: 50000, raisedFormatted: "$49,200", enabled: true  },
  { id: "6",  rank: 6,  title: "Muslim Charity Run 2026", raised:  5000, goal: 50000, raisedFormatted: "$5,000",  enabled: false },
  { id: "7",  rank: 7,  title: "Muslim Charity Run 2026", raised: 19800, goal: 50000, raisedFormatted: "$19,800", enabled: false },
  { id: "8",  rank: 8,  title: "Muslim Charity Run 2026", raised: 37600, goal: 50000, raisedFormatted: "$37,600", enabled: true  },
  { id: "9",  rank: 9,  title: "Muslim Charity Run 2026", raised:  2100, goal: 50000, raisedFormatted: "$2,100",  enabled: false },
  { id: "10", rank: 10, title: "Muslim Charity Run 2026", raised: 25300, goal: 50000, raisedFormatted: "$25,300", enabled: true  },
  { id: "11", rank: 11, title: "Muslim Charity Run 2026", raised: 50000, goal: 50000, raisedFormatted: "$50,000", enabled: true  },
];

// ─── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={enabled}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        enabled ? "bg-[#EC8900]" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200",
          enabled ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const pct = goal > 0 ? Math.min(100, (raised / goal) * 100) : 0;
  return (
    <div className="w-[275px]">
      <p className="text-xs text-gray-500 mb-1">
        <span className="font-semibold text-[#EC8900]">${raised.toLocaleString()}</span>
        {" "}of ${goal.toLocaleString()} goal
      </p>
      <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#EC8900] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 min-w-[200px]">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-400">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-[#161616]">{value}</p>
    </div>
  );
}

// ─── Sortable row ─────────────────────────────────────────────────────────────

interface RowProps {
  campaign: Campaign;
  isDragging?: boolean;
  onToggle: (id: string) => void;
}

function CampaignRow({ campaign: c, isDragging = false, onToggle }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: c.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b border-gray-50",
        isSortableDragging ? "opacity-40 bg-orange-50/30" : "hover:bg-gray-50"
      )}
    >
      {/* Drag handle */}
      <TableCell className="pl-4 py-4 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-[#EC8900] transition-colors touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>

      {/* Rank — reflects current position */}
      <TableCell className="text-sm font-medium text-gray-600">{c.rank}</TableCell>

      {/* Toggle */}
      <TableCell>
        <Toggle enabled={c.enabled} onChange={() => onToggle(c.id)} />
      </TableCell>

      {/* Title */}
      <TableCell className="text-sm font-medium text-gray-700">{c.title}</TableCell>

      {/* Progress */}
      <TableCell>
        <ProgressBar raised={c.raised} goal={c.goal} />
      </TableCell>

      {/* Raised */}
      <TableCell className="text-sm font-semibold text-gray-800">{c.raisedFormatted}</TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm"
            className="rounded-full px-4 text-xs border-gray-300 text-gray-600 hover:border-[#EC8900] hover:text-[#EC8900]"
          >
            View
          </Button>
          <Button variant="outline" size="sm"
            className="rounded-full px-4 text-xs border-gray-300 text-gray-600 hover:border-[#EC8900] hover:text-[#EC8900]"
          >
            Edit
          </Button>
        </div>
      </TableCell>

      {/* Archive */}
      <TableCell>
        <button className="p-1.5 rounded-md text-gray-300 hover:text-[#EC8900] hover:bg-orange-50 transition-colors">
          <Archive className="h-4 w-4" />
        </button>
      </TableCell>
    </TableRow>
  );
}

// Ghost row shown under the cursor while dragging
function DragGhostRow({ campaign: c }: { campaign: Campaign }) {
  return (
    <TableRow className="border border-[#EC8900]/30 bg-orange-50 shadow-lg rounded-lg opacity-95">
      <TableCell className="pl-4 py-4 w-8">
        <GripVertical className="h-4 w-4 text-[#EC8900]" />
      </TableCell>
      <TableCell className="text-sm font-medium text-gray-600">{c.rank}</TableCell>
      <TableCell>
        <Toggle enabled={c.enabled} onChange={() => {}} />
      </TableCell>
      <TableCell className="text-sm font-medium text-gray-700">{c.title}</TableCell>
      <TableCell>
        <ProgressBar raised={c.raised} goal={c.goal} />
      </TableCell>
      <TableCell className="text-sm font-semibold text-gray-800">{c.raisedFormatted}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="rounded-full px-4 text-xs border-gray-300 text-gray-600">View</Button>
          <Button variant="outline" size="sm" className="rounded-full px-4 text-xs border-gray-300 text-gray-600">Edit</Button>
        </div>
      </TableCell>
      <TableCell>
        <button className="p-1.5 rounded-md text-gray-300">
          <Archive className="h-4 w-4" />
        </button>
      </TableCell>
    </TableRow>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PageDetailPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const activeCampaign = activeId ? campaigns.find((c) => c.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setCampaigns((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      // Reorder and reassign rank to match visual position
      return arrayMove(prev, oldIndex, newIndex).map((c, i) => ({ ...c, rank: i + 1 }));
    });
  };

  const toggleCampaign = (id: string) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  };

  return (
    <div className="space-y-5">
      <Link
        href="/campaign/pages"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#EC8900] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Pages
      </Link>

      {/* ── Orange profile banner ── */}
      <div className="rounded-2xl bg-[#EC8900] px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-[#EC8900]">
              AF
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Aissha Fatmawati</h1>
              <p className="text-sm text-orange-100">aisshafatmawati@gmail.com</p>
              <a
                href="#"
                className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-white/20 px-3 py-1 text-xs font-medium text-white hover:bg-white/30 transition-colors"
              >
                https://myfunraisingpage.com/aissha-fatma
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-white bg-white text-[#EC8900] font-semibold hover:bg-orange-50 rounded-lg">
              Edit Profile
            </Button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="flex gap-4">
        <StatCard
          label="Total Amount Raised"
          value="$2,245"
          icon={
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50">
              <TrendingUp className="h-3.5 w-3.5 text-[#EC8900]" />
            </div>
          }
        />
        <StatCard
          label="Total Campaign Joined"
          value="2 Campaigns"
          icon={
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50">
              <span className="h-2.5 w-2.5 rounded-full bg-[#037847]" />
            </div>
          }
        />
      </div>

      {/* ── Sortable campaigns table ── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-white hover:bg-white">
                <TableHead className="w-8 pl-4" />
                <TableHead className="text-xs font-semibold text-gray-500 w-16">Rank</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 w-20">Status</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500">Campaign Title</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500">Amount Raised</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 w-24">Raised</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 w-32">Actions</TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 w-16">Archive</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext items={campaigns.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                {campaigns.map((c) => (
                  <CampaignRow key={c.id} campaign={c} onToggle={toggleCampaign} />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </div>

        {/* Ghost row that follows the cursor */}
        <DragOverlay>
          {activeCampaign && (
            <table className="w-full border-collapse">
              <tbody>
                <DragGhostRow campaign={activeCampaign} />
              </tbody>
            </table>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
