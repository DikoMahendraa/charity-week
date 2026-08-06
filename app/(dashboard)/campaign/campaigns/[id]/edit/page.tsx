"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Copy, Plus, ImageIcon, X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RichEditor } from "./RichEditor";
import { DatePicker } from "./DatePicker";

// ─── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={enabled}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
        enabled ? "bg-[#EC8900]" : "bg-gray-200"
      )}
    >
      <span className={cn(
        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200",
        enabled ? "translate-x-5" : "translate-x-0"
      )} />
    </button>
  );
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-1.5">
      <div
        onClick={onChange}
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded border transition-colors",
          checked ? "border-[#EC8900] bg-[#EC8900]" : "border-gray-300 bg-white"
        )}
      >
        {checked && (
          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-xs text-gray-700">{label}</span>
    </label>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({ id, title, subtitle, children }: {
  id: string; title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-6 rounded-xl border border-gray-100 bg-white p-6">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

// ─── Counted input ────────────────────────────────────────────────────────────

function CountedInput({
  label, placeholder, max, value, onChange, hint,
}: {
  label: string; placeholder: string; max: number;
  value: string; onChange: (v: string) => void; hint?: string;
}) {
  return (
    <div className="flex-1 space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-400">{value.length} / {max}</span>
      </div>
      <Input
        value={value}
        onChange={e => onChange(e.target.value.slice(0, max))}
        placeholder={placeholder}
        className="h-10 rounded-lg border border-gray-200 text-sm"
      />
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// ─── Notification row ─────────────────────────────────────────────────────────

interface NotifRow { id: number; percent: string; notifyAdmin: boolean; notifyFundraiser: boolean; }

function NotifRowUI({ row, onChange, showWarning, onRemove }: {
  row: NotifRow; onChange: (r: NotifRow) => void;
  showWarning?: boolean; onRemove: () => void;
}) {
  return (
    <div className="relative flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <div>
        <p className="text-xs font-medium text-gray-500">Target % Reached</p>
        <div className="mt-1 flex items-center gap-1.5">
          <Input
            type="number"
            min={1} max={100}
            value={row.percent}
            onChange={e => onChange({ ...row, percent: e.target.value })}
            className="h-8 w-16 rounded-md border border-gray-200 text-center text-sm"
          />
          <span className="text-sm font-semibold text-gray-600">%</span>
        </div>
        {showWarning && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#EC8900]">
            <span>⚠</span> Larger value needed
          </p>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500">Who should we notify?</p>
        <div className="mt-1 flex items-center gap-3">
          <Checkbox
            checked={row.notifyAdmin}
            onChange={() => onChange({ ...row, notifyAdmin: !row.notifyAdmin })}
            label="Admin"
          />
          <Checkbox
            checked={row.notifyFundraiser}
            onChange={() => onChange({ ...row, notifyFundraiser: !row.notifyFundraiser })}
            label="Fundraiser"
          />
        </div>
      </div>

      <button
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-gray-300 hover:bg-gray-200 hover:text-gray-500 transition-colors"
        title="Remove"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

// ─── Media file preview ───────────────────────────────────────────────────────

interface MediaFile { id: number; url: string; type: "image"; name: string; }

// ─── YouTube helpers ──────────────────────────────────────────────────────────

function getYouTubeId(url: string): string | null {
  if (!url.trim()) return null;
  try {
    const u = new URL(url);
    // youtube.com/watch?v=ID
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }
    // youtu.be/ID
    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1).split("?")[0] || null;
    }
    // youtube.com/embed/ID  or  youtube.com/shorts/ID
    const match = u.pathname.match(/\/(embed|shorts|v)\/([^/?&]+)/);
    if (match) return match[2];
  } catch {
    // not a valid URL yet
  }
  return null;
}

// ─── Sidebar nav ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "basics",        num: 1, label: "Basics"                    },
  { id: "notifications", num: 2, label: "Fundraising notifications" },
  { id: "story",         num: 3, label: "Story & media"             },
  { id: "settings",      num: 4, label: "Page settings"             },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditCampaignPage() {
  // Basics
  const [title,        setTitle]        = useState("");
  const [targetDonors, setTargetDonors] = useState("");
  const [subtitle,     setSubtitle]     = useState("");
  const [startDate,    setStartDate]    = useState<Date | undefined>();
  const [endDate,      setEndDate]      = useState<Date | undefined>();

  // Notifications
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [notifRows,    setNotifRows]    = useState<NotifRow[]>([
    { id: 1, percent: "10", notifyAdmin: true,  notifyFundraiser: true },
    { id: 2, percent: "30", notifyAdmin: true,  notifyFundraiser: true },
  ]);

  // Media
  const [mediaFiles,  setMediaFiles]  = useState<MediaFile[]>([]);
  const [youtubeUrl,  setYoutubeUrl]  = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Page settings
  const slug = "edit-to-firdaus-jannah-org-1-fauzan-ammanahfy-4";
  const [showBar,        setShowBar]        = useState(true);
  const [showCampaign,   setShowCampaign]   = useState(true);
  const [showTeam,       setShowTeam]       = useState(true);
  const [notifyDonation, setNotifyDonation] = useState(true);

  const [activeSection, setActiveSection] = useState("basics");
  const [copied,        setCopied]        = useState(false);

  // ── Notification handlers ──────────────────────────────────────────────────
  function addNotifRow() {
    setNotifRows(prev => [...prev, { id: Date.now(), percent: "50", notifyAdmin: true, notifyFundraiser: false }]);
  }
  function updateRow(updated: NotifRow) {
    setNotifRows(prev => prev.map(r => r.id === updated.id ? updated : r));
  }
  function removeRow(id: number) {
    setNotifRows(prev => prev.filter(r => r.id !== id));
  }

  // ── Media handlers ─────────────────────────────────────────────────────────
  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setMediaFiles(prev => [...prev, { id: Date.now() + Math.random(), url, type: "image", name: file.name }]);
    });
    e.target.value = "";
  }

  function removeMedia(id: number) {
    setMediaFiles(prev => prev.filter(m => m.id !== id));
  }

  // ── Sidebar scroll ─────────────────────────────────────────────────────────
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  }

  // ── Copy slug ──────────────────────────────────────────────────────────────
  function copySlug() {
    navigator.clipboard.writeText(slug).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex gap-6">

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5 pb-12">

        {/* Back + title */}
        <div>
          <Link
            href="/campaign/pages/1"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#EC8900] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Edit - {"{Campaign Name}"}
          </Link>
          <p className="mt-0.5 text-xs text-gray-400">Edit and save your campaign</p>
        </div>

        {/* ── 1. Basics ──────────────────────────────────────────────────── */}
        <Section id="basics" title="Basics" subtitle="The essentials donors see first — keep it clear and compelling.">
          <div className="space-y-4">
            <div className="flex gap-4">
              <CountedInput
                label="Campaign Title"
                placeholder="e.g. Clean Water Wells in East Java"
                max={65}
                value={title}
                onChange={setTitle}
              />
              <CountedInput
                label="Target donors"
                placeholder="50,000"
                max={65}
                value={targetDonors}
                onChange={setTargetDonors}
                hint="How many donors would you like this fundraising page to reach?"
              />
            </div>

            <CountedInput
              label="Campaign Subtitle"
              placeholder="A one-line hook that grabs donors' attention."
              max={175}
              value={subtitle}
              onChange={setSubtitle}
              hint="This displays at the top of the main campaign page below the 'campaign name'"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Campaign end date</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Pick start date"
                  />
                </div>
                <div className="flex-1">
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="Pick end date"
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 2. Fundraising notifications ───────────────────────────────── */}
        <Section
          id="notifications"
          title="Fundraising notifications"
          subtitle="Get notified when donations are received"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-end">
              <Toggle enabled={notifEnabled} onChange={() => setNotifEnabled(v => !v)} />
            </div>

            {notifEnabled && (
              <>
                {notifRows.map((row, i) => (
                  <NotifRowUI
                    key={row.id}
                    row={row}
                    onChange={updateRow}
                    onRemove={() => removeRow(row.id)}
                    showWarning={i === 0 && parseInt(row.percent) < 15}
                  />
                ))}
                <button
                  onClick={addNotifRow}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#EC8900] py-3 text-sm font-medium text-[#EC8900] hover:bg-orange-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add New
                </button>
              </>
            )}
          </div>
        </Section>

        {/* ── 3. Story & media ───────────────────────────────────────────── */}
        <Section id="story" title="Story & media" subtitle="Tell the full story, then bring it to life with images and video.">
          <div className="space-y-5">

            {/* Rich text editor */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Full description</label>
              <RichEditor placeholder="Write a comprehensive story about your campaigns, who it benefits, and why people should donate." />
            </div>

            {/* Images */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-gray-700">Images</label>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-8 hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                  <ImageIcon className="h-5 w-5 text-[#EC8900]" />
                </div>
                <span className="text-sm font-medium text-[#EC8900]">Upload images</span>
                <span className="text-xs text-gray-400">PNG/JPG · up to 5 · max 5MB each</span>
              </button>
              <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />

              {/* Thumbnail strip */}
              {mediaFiles.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {mediaFiles.map(m => (
                    <div key={m.id} className="group relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
                      <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeMedia(m.id)}
                        className="absolute right-0.5 top-0.5 hidden h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white group-hover:flex"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campaign Video — YouTube URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Campaign Video</label>
                <span className="text-xs text-gray-400">Paste the URL for the Youtube video, not the embed code.</span>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                    {/* YouTube play icon */}
                    <svg className="h-3.5 w-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
                    </svg>
                    Youtube Video URL
                  </label>
                  <Input
                    value={youtubeUrl}
                    onChange={e => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="h-10 rounded-lg border border-gray-200 bg-white text-sm"
                  />
                </div>

                {/* Live embed preview */}
                {(() => {
                  const videoId = getYouTubeId(youtubeUrl);
                  if (!videoId) return null;
                  return (
                    <div className="overflow-hidden rounded-lg aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                  );
                })()}

                {youtubeUrl && !getYouTubeId(youtubeUrl) && (
                  <p className="text-xs text-red-400">Please enter a valid YouTube URL.</p>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* ── 4. Page settings ───────────────────────────────────────────── */}
        <Section id="settings" title="Page settings" subtitle="Choose what information donors provide at sign-up.">
          <div className="space-y-5">
            {/* Custom URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Custom URLs</label>
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                <span className="shrink-0 border-r border-gray-100 bg-gray-50 px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">
                  https://org.tbcpltw.com/
                </span>
                <input
                  readOnly
                  value={slug}
                  className="flex-1 min-w-0 bg-white px-3 py-2.5 text-xs text-gray-600 outline-none"
                />
                <button
                  onClick={copySlug}
                  className="shrink-0 border-l border-gray-100 px-3 py-2.5 text-xs font-medium transition-colors hover:bg-gray-50"
                  title="Copy slug"
                >
                  {copied ? (
                    <span className="text-[#14BA6D]">Copied!</span>
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Toggles */}
            {[
              { label: "Show fundraising bar and target",                      value: showBar,        set: setShowBar        },
              { label: "Show campaign that the fundraiser is fundraising for",  value: showCampaign,   set: setShowCampaign   },
              { label: "Show team name that the fundraiser belongs to",         value: showTeam,       set: setShowTeam       },
              { label: "Notify me everytime someone donates",                   value: notifyDonation, set: setNotifyDonation },
            ].map(({ label, value, set }) => (
              <div key={label} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <span className="text-sm text-gray-700">{label}</span>
                <Toggle enabled={value} onChange={() => set(v => !v)} />
              </div>
            ))}
          </div>
        </Section>

        {/* Save */}
        <div className="flex justify-end">
          <Button className="bg-[#EC8900] px-8 font-bold text-white hover:bg-[#d47800]">
            Save Changes
          </Button>
        </div>
      </div>

      {/* ── Sticky sidebar nav ───────────────────────────────────────────── */}
      <aside className="hidden w-56 shrink-0 xl:block">
        <div className="sticky top-6 rounded-xl border border-gray-100 bg-white p-4">
          {SECTIONS.map(({ id, num, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors text-left",
                activeSection === id
                  ? "bg-orange-50 font-semibold text-[#EC8900]"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <span className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                activeSection === id ? "bg-[#EC8900] text-white" : "bg-gray-100 text-gray-500"
              )}>
                {num}
              </span>
              {label}
            </button>
          ))}
        </div>
      </aside>

    </div>
  );
}
