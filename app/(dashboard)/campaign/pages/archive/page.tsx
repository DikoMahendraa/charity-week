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
import { ArrowLeft, GripVertical, ArchiveRestore, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Data ────────────────────────────────────────────────────────────────────

interface ArchivedCampaign {
  id:             string;
  rank:           number;
  title:          string;
  raised:         number;
  goal:           number;
  raisedFormatted: string;
  enabled:        boolean;
}

const initialArchived: ArchivedCampaign[] = [
  { id: "1", rank: 1, title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$25,000", enabled: true  },
  { id: "2", rank: 2, title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$25,000", enabled: false },
  { id: "3", rank: 3, title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$25,000", enabled: true  },
  { id: "4", rank: 4, title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$25,000", enabled: false },
  { id: "5", rank: 5, title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$25,000", enabled: true  },
  { id: "6", rank: 6, title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$25,000", enabled: false },
  { id: "7", rank: 7, title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$25,000", enabled: false },
  { id: "8", rank: 8, title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$25,000", enabled: false },
  { id: "9", rank: 9, title: "Muslim Charity Run 2026", raised: 12092, goal: 50000, raisedFormatted: "$25,000", enabled: false },
];

// ─── Filter chip ─────────────────────────────────────────────────────────────

function FilterChip({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
    </button>
  );
}

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
    <div className="w-[240px]">
      <p className="text-xs text-gray-500 mb-1">
        <span className="font-semibold text-[#EC8900]">${raised.toLocaleString()}</span>
        {" "}of ${goal.toLocaleString()} goal.
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

// ─── Sortable row ─────────────────────────────────────────────────────────────

interface RowProps {
  campaign:   ArchivedCampaign;
  onToggle:   (id: string) => void;
  onUnarchive: (id: string) => void;
}

function ArchivedRow({ campaign: c, onToggle, onUnarchive }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: c.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b border-gray-50",
        isDragging ? "opacity-40 bg-orange-50/30" : "hover:bg-gray-50"
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

      {/* Rank */}
      <TableCell className="text-sm font-medium text-gray-600 w-16">{c.rank}</TableCell>

      {/* Toggle */}
      <TableCell className="w-20">
        <Toggle enabled={c.enabled} onChange={() => onToggle(c.id)} />
      </TableCell>

      {/* Title */}
      <TableCell className="text-sm font-medium text-gray-700">{c.title}</TableCell>

      {/* Progress */}
      <TableCell>
        <ProgressBar raised={c.raised} goal={c.goal} />
      </TableCell>

      {/* Raised */}
      <TableCell className="text-sm font-semibold text-gray-800 w-24">{c.raisedFormatted}</TableCell>

      {/* Unarchive */}
      <TableCell className="w-20">
        <button
          onClick={() => onUnarchive(c.id)}
          className="p-1.5 rounded-md text-[#EC8900] hover:bg-orange-50 transition-colors"
          aria-label="Unarchive"
        >
          <ArchiveRestore className="h-4 w-4" />
        </button>
      </TableCell>
    </TableRow>
  );
}

// Ghost row
function GhostRow({ campaign: c }: { campaign: ArchivedCampaign }) {
  return (
    <TableRow className="border border-[#EC8900]/30 bg-orange-50 shadow-lg opacity-95">
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
        <button className="p-1.5 rounded-md text-gray-300">
          <ArchiveRestore className="h-4 w-4" />
        </button>
      </TableCell>
    </TableRow>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ArchivedPage() {
  const [campaigns, setCampaigns] = useState(initialArchived);
  const [activeId,  setActiveId]  = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const activeCampaign = activeId ? campaigns.find(c => c.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    setCampaigns(prev => {
      const oldIndex = prev.findIndex(c => c.id === active.id);
      const newIndex = prev.findIndex(c => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex).map((c, i) => ({ ...c, rank: i + 1 }));
    });
  }

  function toggleCampaign(id: string) {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  }

  function unarchiveCampaign(id: string) {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <Link
          href="/campaign/pages"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-[#EC8900] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xl font-bold">Archived</span>
        </Link>
        <p className="mt-1 text-sm text-gray-400">Review back to data you&apos;ve already archived.</p>
      </div>

      {/* Search + Status/Type filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Fundraising Pages"
            className="pl-9 bg-white w-full rounded-sm border border-[#D7D7D7] py-3"
          />
        </div>
        <FilterChip label="Status: All" />
        <FilterChip label="Type: All" />
      </div>

      {/* Row of secondary filters */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip label="Date range: All" />
        <FilterChip label="Region: All" />
        <FilterChip label="Institution Type: All" />
        <FilterChip label="Institution: All" />
        <FilterChip label="Page Type: All" />
      </div>

      {/* Table */}
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
                <TableHead className="text-xs font-semibold text-gray-500 w-20">Unarchive</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext items={campaigns.map(c => c.id)} strategy={verticalListSortingStrategy}>
                {campaigns.map(c => (
                  <ArchivedRow
                    key={c.id}
                    campaign={c}
                    onToggle={toggleCampaign}
                    onUnarchive={unarchiveCampaign}
                  />
                ))}
              </SortableContext>
            </TableBody>
          </Table>

          {campaigns.length === 0 && (
            <div className="py-16 text-center text-sm text-gray-400">
              No archived campaigns.
            </div>
          )}
        </div>

        <DragOverlay>
          {activeCampaign && (
            <table className="w-full border-collapse">
              <tbody>
                <GhostRow campaign={activeCampaign} />
              </tbody>
            </table>
          )}
        </DragOverlay>
      </DndContext>

    </div>
  );
}
