"use client";

import { useRouter } from "next/navigation";
import DonateButton from "./DonateButton";

interface Props {
  fundraiserId: string;
  fundraiserName: string;
  challengeTitle: string;
  raised: number;
  goal: number;
  pct: number;
  totalDonors: number;
  daysLeft: number;
}

function formatShort(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `£${(n / 1_000).toFixed(0)}K`;
  return `£${n}`;
}

function formatFull(n: number): string {
  return "£" + n.toLocaleString("en-GB");
}

export default function StatsCard({
  fundraiserId, fundraiserName, challengeTitle,
  raised, goal, pct, totalDonors, daysLeft,
}: Props) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/fundraise/${fundraiserId}/dashboard`)}
      className="mx-4 mt-3 cursor-pointer rounded-2xl bg-white p-5 shadow-sm ring-1 ring-transparent transition-all hover:shadow-md hover:ring-[#EC8900]/20 active:scale-[0.99]"
    >
      <h1 className="mb-1 text-base font-bold text-gray-700">{challengeTitle}</h1>
      <p className="text-4xl font-extrabold leading-none text-gray-900">{formatFull(raised)}</p>
      <p className="mb-4 mt-1 text-sm text-gray-400">raised of {formatFull(goal)} goal</p>

      {/* Progress bar */}
      <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
        <span className="font-semibold text-gray-700">{formatFull(raised)} Raised</span>
        <span>Goal: {formatShort(goal)}</span>
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full rounded-full bg-[#EC8900]" style={{ width: `${pct}%` }} />
      </div>

      {/* Donors + days */}
      <div className="mb-5 grid grid-cols-2 divide-x divide-gray-100">
        <div className="pr-4">
          <p className="text-xl font-extrabold text-gray-900">{totalDonors.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Generous Donors</p>
        </div>
        <div className="pl-4">
          <p className="text-xl font-extrabold text-gray-900">{daysLeft} Days</p>
          <p className="text-xs text-gray-400">Time Remaining</p>
        </div>
      </div>

      {/* Donate button  stop propagation so card click doesn't also fire */}
      <div onClick={e => e.stopPropagation()}>
        <DonateButton fundraiserId={fundraiserId} fundraiserName={fundraiserName} />
      </div>

      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secure 256-bit SSL encrypted payment
      </p>
    </div>
  );
}
