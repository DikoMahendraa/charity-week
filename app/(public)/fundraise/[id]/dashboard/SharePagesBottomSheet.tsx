"use client";

import { useEffect, useState } from "react";
import ShareWithFriendsSheet, { type SharePageInfo } from "./ShareWithFriendsSheet";

interface SharePage {
  id:       number;
  title:    string;
  image:    string;
  raised:   number;
  goal:     number;
  donors:   number;
  daysLeft: number;
  location: string;
}

const SHARE_PAGES: SharePage[] = [
  {
    id:       1,
    title:    "CW 10k Run!",
    image:    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=300&fit=crop",
    raised:   1247893,
    goal:     1600000,
    donors:   3412,
    daysLeft: 12,
    location: "London",
  },
  {
    id:       2,
    title:    "CW 10k Run!",
    image:    "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=600&h=300&fit=crop",
    raised:   1247893,
    goal:     1600000,
    donors:   3412,
    daysLeft: 12,
    location: "London",
  },
];

function formatShort(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `£${(n / 1_000).toFixed(0)}K`;
  return `£${n}`;
}

function formatFull(n: number): string {
  return "£" + n.toLocaleString("en-GB");
}

function PageCard({ page, onShare }: { page: SharePage; onShare: (page: SharePage) => void }) {
  const pct = Math.min(100, Math.round((page.raised / page.goal) * 100));

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="h-44 overflow-hidden">
        <img src={page.image} alt={page.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="mb-1 text-base font-bold text-gray-900">{page.title}</h3>
        <p className="text-3xl font-extrabold leading-tight text-gray-900">{formatFull(page.raised)}</p>
        <p className="mb-3 mt-0.5 text-sm text-gray-400">raised of {formatFull(page.goal)} goal</p>

        <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-[#EC8900]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="font-semibold text-[#EC8900]">{pct}% completed</span>
          <span className="text-gray-400">Goal: {formatShort(page.goal)}</span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
          <div>
            <p className="text-base font-bold text-gray-900">{page.donors.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Generous Donors</p>
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">{page.daysLeft} Days</p>
            <p className="text-xs text-gray-400">Time Remaining</p>
          </div>
        </div>

        <button
          onClick={() => onShare(page)}
          className="w-full rounded-xl bg-[#EC8900] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#d47a00] active:scale-[0.99]"
        >
          Share this page
        </button>
      </div>
    </div>
  );
}

interface Props {
  open:    boolean;
  onClose: () => void;
}

export default function SharePagesBottomSheet({ open, onClose }: Props) {
  const [mounted, setMounted]           = useState(false);
  const [visible, setVisible]           = useState(false);
  const [selectedPage, setSelectedPage] = useState<SharePage | null>(null);
  const [friendsOpen, setFriendsOpen]   = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  function handleShare(page: SharePage) {
    setSelectedPage(page);
    setFriendsOpen(true);
  }

  const friendsPageInfo: SharePageInfo | null = selectedPage
    ? { id: selectedPage.id, title: selectedPage.title, image: selectedPage.image, location: selectedPage.location }
    : null;

  if (!mounted) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
          onClick={onClose}
        />

        {/* Sheet */}
        <div
          className="relative w-full max-w-[430px] rounded-t-2xl bg-[#F7F9FB] shadow-2xl transition-transform duration-300 ease-out"
          style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-white px-5 py-4 shadow-sm">
            <h2 className="text-base font-bold text-gray-900">Share your Pages</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable page cards */}
          <div className="max-h-[80dvh] overflow-y-auto overscroll-contain">
            <div className="flex flex-col gap-4 p-4 pb-10">
              {SHARE_PAGES.map(page => (
                <PageCard key={page.id} page={page} onShare={handleShare} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nested share-with-friends sheet */}
      <ShareWithFriendsSheet
        open={friendsOpen}
        onClose={() => setFriendsOpen(false)}
        page={friendsPageInfo}
      />
    </>
  );
}
