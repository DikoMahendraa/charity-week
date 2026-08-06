"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Donor, DashboardData, FundraiserPage } from "../fundraiser-data";
import SharePagesBottomSheet from "./SharePagesBottomSheet";

type Tab = "overview" | "donations" | "page";

interface Props {
  fundraiserId: string;
  fundraiserName: string;
  challengeTitle: string;
  dashboard: DashboardData;
  recentDonors: Donor[];
  publicUrl: string;
}

function formatFull(n: number): string {
  return "£" + n.toLocaleString("en-GB");
}

/* ── Donor row ──────────────────────────────────────────────── */
function DonorRow({ donor }: { donor: Donor }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
        <img src={donor.avatar} alt={donor.name} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900">{donor.name}</p>
        <p className="truncate text-xs text-gray-400">{donor.message}  {donor.timeAgo}</p>
      </div>
      <p className="shrink-0 text-sm font-bold text-gray-900">{formatFull(donor.amount)}</p>
    </li>
  );
}

/* ── Skeleton matching DonorRow card style ──────────────────── */
function SkeletonCard() {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 animate-pulse rounded-full bg-gray-200" />
        <div className="h-2.5 w-40 animate-pulse rounded-full bg-gray-200" />
      </div>
      <div className="h-3 w-14 animate-pulse rounded-full bg-gray-200" />
    </li>
  );
}

/* ── Overview tab ───────────────────────────────────────────── */
function OverviewTab({ fundraiserName, dashboard, recentDonors, publicUrl }: Omit<Props, "challengeTitle" | "fundraiserId">) {
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const { raised, targetPct, donationsCount, leaderboardRank, leaderboardGroup, amountBehind, totalDonors, allDonationsCount } = dashboard;

  const allDonors = useMemo<Donor[]>(() => {
    const extra = allDonationsCount - recentDonors.length;
    const generated: Donor[] = Array.from({ length: Math.max(0, extra) }, (_, i) => ({
      id: 2000 + i,
      name: EXTRA_NAMES[i % EXTRA_NAMES.length],
      message: EXTRA_MESSAGES[i % EXTRA_MESSAGES.length],
      timeAgo: `${(i + 1) * 3 + 5}m ago`,
      amount: Math.max(100, recentDonors[0].amount - (i + 1) * 80),
      avatar: EXTRA_AVATARS[i % EXTRA_AVATARS.length],
      isGiftAid: i % 3 === 0,
      isAnonymous: i % 7 === 0,
    }));
    return [...recentDonors, ...generated];
  }, [recentDonors, allDonationsCount]);

  const displayed = showAll ? allDonors : recentDonors;

  function handleShare() {
    setShareOpen(true);
  }

  async function handleSeeAll() {
    setLoading(true);
    await new Promise<void>(r => setTimeout(r, 1400));
    setLoading(false);
    setShowAll(true);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Stats card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5 grid grid-cols-3 divide-x divide-gray-100">
          <div className="pr-3">
            <p className="text-lg font-extrabold text-gray-900">{formatFull(raised)}</p>
            <p className="text-xs text-gray-400">Raised</p>
          </div>
          <div className="px-3">
            <p className="text-lg font-extrabold text-gray-900">{targetPct}%</p>
            <p className="text-xs text-gray-400">Of target</p>
          </div>
          <div className="pl-3">
            <p className="text-lg font-extrabold text-gray-900">{donationsCount}</p>
            <p className="text-xs text-gray-400">Donations</p>
          </div>
        </div>

        {/* Leaderboard nudge */}
        <div className="mb-4 rounded-xl border border-[#EC8900]/30 bg-[#FFF8EE] px-4 py-3">
          <p className="text-sm leading-snug text-gray-700">
            You&apos;re {leaderboardRank}# in {leaderboardGroup} {" "}
            <span className="font-bold text-gray-900">{formatFull(amountBehind)}</span>{" "}
            behind #{leaderboardRank - 1}. Share your page to climb.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            className="w-full rounded-2xl bg-[#EC8900] py-4 text-sm font-bold text-white transition-colors hover:bg-[#d47a00] active:scale-[0.99]"
          >
            Share Your Page
          </button>
          <Link
            href={publicUrl}
            className="flex w-full items-center justify-center rounded-2xl border-2 border-[#EC8900] py-3.5 text-sm font-bold text-[#EC8900] transition-colors hover:bg-orange-50"
          >
            View Public Page
          </Link>
        </div>
      </div>

      {/* Latest donations card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-gray-900">Latest Donations</h2>
          <span className="text-xs font-semibold text-[#EC8900]">
            {totalDonors.toLocaleString()} donors
          </span>
        </div>

        <ul className="flex flex-col gap-2">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : displayed.map(donor => <DonorRow key={donor.id} donor={donor} />)
          }
        </ul>

        <div className="mt-4 border-t border-gray-100 pt-3 text-center">
          {showAll ? (
            <p className="text-xs text-gray-400">Showing all {allDonationsCount} donations</p>
          ) : (
            <button
              onClick={handleSeeAll}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 text-sm font-bold text-[#EC8900] underline-offset-2 hover:underline disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Loading donations…
                </>
              ) : (
                `See All (${allDonationsCount}) Donations`
              )}
            </button>
          )}
        </div>
      </div>

      <SharePagesBottomSheet open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}

/* ── Donations tab ──────────────────────────────────────────── */
type DonationFilter = "all" | "message" | "giftaid" | "anonymous";

const FILTERS: { key: DonationFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "message", label: "With message" },
  { key: "giftaid", label: "GiftAid" },
  { key: "anonymous", label: "Anonymous" },
];

const EXTRA_NAMES = ["Yusuf A.", "Mia C.", "Tariq B.", "Priya K.", "Leon S.", "Hana M.", "Zaid R.", "Clara N.", "Omar F.", "Beth T.", "Nadia J.", "Kai W.", "Amara O.", "Finn L.", "Rania H."];
const EXTRA_MESSAGES = ["Zakat", '"Keep going!"', "Sadaqah", '"Amazing cause!"', "Zakat", '"So proud of you!"', "Sadaqah", '"You got this!"', "Zakat", '"Inspiring!"', "Sadaqah", '"Best of luck!"', "Zakat", '"Go team!"', "Sadaqah"];
const EXTRA_AVATARS = [
  "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1530268729831-4b0b9e170218?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
];

function SkeletonRow() {
  return (
    <li className="flex items-center gap-3 border-b border-gray-100 py-3.5 last:border-b-0">
      <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 animate-pulse rounded-full bg-gray-200" />
        <div className="h-2.5 w-40 animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="h-3 w-14 animate-pulse rounded-full bg-gray-200" />
    </li>
  );
}

function DonationsTab({ recentDonors, dashboard }: { recentDonors: Donor[]; dashboard: DashboardData }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DonationFilter>("all");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  const { raised, donationsCount, targetPct, totalDonors, allDonationsCount, giftAidAmount, giftAidGifts } = dashboard;

  // Extended list generated from seed data  stable across renders
  const allDonors = useMemo<Donor[]>(() => {
    const extra = allDonationsCount - recentDonors.length;
    const generated: Donor[] = Array.from({ length: Math.max(0, extra) }, (_, i) => ({
      id: 1000 + i,
      name: EXTRA_NAMES[i % EXTRA_NAMES.length],
      message: EXTRA_MESSAGES[i % EXTRA_MESSAGES.length],
      timeAgo: `${(i + 1) * 3 + 5}m ago`,
      amount: Math.max(100, recentDonors[0].amount - (i + 1) * 80),
      avatar: EXTRA_AVATARS[i % EXTRA_AVATARS.length],
      isGiftAid: i % 3 === 0,
      isAnonymous: i % 7 === 0,
    }));
    return [...recentDonors, ...generated];
  }, [recentDonors, allDonationsCount]);

  const source = showAll ? allDonors : recentDonors;
  const filtered = source.filter(donor => {
    const q = search.toLowerCase();
    const matchSearch = q === "" ||
      donor.name.toLowerCase().includes(q) ||
      donor.message.toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ? true :
        filter === "message" ? donor.message.startsWith('"') :
          filter === "giftaid" ? !!donor.isGiftAid :
            filter === "anonymous" ? !!donor.isAnonymous :
              true;
    return matchSearch && matchFilter;
  });

  async function handleSeeAll() {
    setLoading(true);
    await new Promise<void>(r => setTimeout(r, 1400));
    setLoading(false);
    setShowAll(true);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Summary stats card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <div className="pr-3">
            <p className="text-lg font-extrabold text-gray-900">{formatFull(raised)}</p>
            <p className="text-xs text-gray-400">Raised</p>
          </div>
          <div className="px-3">
            <p className="text-lg font-extrabold text-gray-900">{donationsCount}</p>
            <p className="text-xs text-gray-400">Donations</p>
          </div>
          <div className="pl-3">
            <p className="text-lg font-extrabold text-gray-900">{targetPct}%</p>
            <p className="text-xs text-gray-400">Of target</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-400">
          <span>GiftAid eligible</span>
          <span>{formatFull(giftAidAmount)} - {giftAidGifts} gifts</span>
        </div>
      </div>

      {/* All donations card */}
      <div className="rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-base font-extrabold text-gray-900">All Donations</h2>
          <span className="text-xs font-semibold text-[#EC8900]">{totalDonors.toLocaleString()} donors</span>
        </div>

        {/* Search */}
        <div className="px-5 pt-3">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5">
            <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search donor or message"
              className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto px-5 pb-1 pt-3 [scrollbar-width:none]">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${filter === f.key
                ? "bg-[#EC8900] text-white"
                : "border border-gray-200 bg-white text-gray-500 hover:border-[#EC8900]/40 hover:text-[#EC8900]"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Donor rows / skeletons */}
        <ul className="mt-2 px-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
          ) : filtered.length === 0 ? (
            <li className="py-8 text-center text-sm text-gray-400">No donations match your search</li>
          ) : (
            filtered.map(donor => (
              <li key={donor.id} className="flex items-center gap-3 border-b border-gray-100 py-3.5 last:border-b-0">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  <img src={donor.avatar} alt={donor.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">{donor.name}</p>
                  <p className="truncate text-xs text-gray-400">{donor.message}  {donor.timeAgo}</p>
                </div>
                <p className="shrink-0 text-sm font-bold text-gray-900">{formatFull(donor.amount)}</p>
              </li>
            ))
          )}
        </ul>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4 text-center">
          {showAll ? (
            <p className="text-xs text-gray-400">Showing all {allDonationsCount} donations</p>
          ) : (
            <button
              onClick={handleSeeAll}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 text-sm font-bold text-[#EC8900] underline-offset-2 hover:underline disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Loading donations…
                </>
              ) : (
                `See All (${allDonationsCount}) Donations`
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page tab ───────────────────────────────────────────────── */
function PageTab({ pages }: { pages: FundraiserPage[] }) {
  return (
    <div className="flex flex-col gap-3">
      {pages.map(page => (
        <div key={page.id} className="flex items-start justify-between rounded-2xl bg-white p-5 shadow-sm">
          <div>
            <p className="text-base font-extrabold text-gray-900">{page.title}</p>
            <p className="mt-1 text-sm text-gray-400">{page.subtitle}</p>
          </div>
          <Link
            href={page.editHref}
            className="ml-4 shrink-0 text-sm font-bold text-[#EC8900] hover:underline"
          >
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
}

/* ── Main client ────────────────────────────────────────────── */
const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "donations", label: "Donations" },
  { key: "page", label: "Page" },
];

export default function DashboardClient(props: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { fundraiserId, fundraiserName, challengeTitle, dashboard, recentDonors, publicUrl } = props;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex rounded-xl bg-gray-100 p-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${activeTab === tab.key
              ? "bg-white text-[#EC8900] shadow-sm"
              : "text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-3">
        {activeTab === "overview" && (
          <OverviewTab
            fundraiserName={fundraiserName}
            dashboard={dashboard}
            recentDonors={recentDonors}
            publicUrl={publicUrl}
          />
        )}
        {activeTab === "donations" && (
          <DonationsTab recentDonors={recentDonors} dashboard={dashboard} />
        )}
        {activeTab === "page" && (
          <PageTab pages={dashboard.pages} />
        )}
      </div>
    </div>
  );
}
