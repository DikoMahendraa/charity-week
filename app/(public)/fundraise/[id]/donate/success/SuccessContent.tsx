"use client";

import { useState }        from "react";
import Link                from "next/link";
import { useDonationStore } from "@/lib/stores/donationStore";
import LottiePlayer        from "./LottiePlayer";

// import donationAnimation from "./donation.json"; // ← swap in the real lottie file here

interface Props {
  fundraiserId:   string;
  fundraiserName: string;
  raised:         number;
  goal:           number;
  pageUrl:        string;
  email:          string;
  total:          number;
}

function formatFull(n: number) { return "£" + n.toLocaleString("en-GB"); }

function formatShort(n: number) {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `£${(n / 1_000).toFixed(0)}K`;
  return `£${n}`;
}

function truncateEmail(email: string) {
  if (!email) return "you@...";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 3)}...@${domain}`;
}

export default function SuccessContent({
  fundraiserId, fundraiserName, raised, goal, pageUrl, email, total,
}: Props) {
  const store   = useDonationStore();
  const base    = total > 0 ? total : store.baseAmount();
  const giftAid = Math.round(base * 0.25 * 100) / 100;
  const pct     = Math.min(100, Math.round((raised / goal) * 100));

  const [copied, setCopied] = useState(false);

  const encodedMsg = encodeURIComponent(`I just donated to ${fundraiserName}'s fundraising page! ${pageUrl}`);
  const encoded    = encodeURIComponent(pageUrl);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silently ignore */ }
  }

  return (
    <div className="flex flex-col">

      {/* ── Success banner ───────────────────────────────────────── */}
      <div className="mx-4 mt-4 rounded-2xl border border-green-200 bg-green-50 px-5 py-3.5 text-center">
        <p className="text-sm font-bold text-green-600">Success message</p>
      </div>

      {/* ── Lottie animation ─────────────────────────────────────── */}
      <LottiePlayer
        animationData={undefined /* replace with imported JSON */}
        loop
        className="mx-4 mt-4 h-64 w-auto rounded-2xl"
      />

      {/* ── Thank you heading ─────────────────────────────────────── */}
      <h1 className="mt-5 px-6 text-center text-2xl font-extrabold leading-tight text-gray-900">
        Thank you for your donation!
      </h1>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      <div className="mt-4 px-4">
        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-[#EC8900] transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          {formatFull(raised)} raised of {formatShort(goal)} · {fundraiserName}&apos;s page
        </p>
      </div>

      {/* ── Summary card ─────────────────────────────────────────── */}
      <div className="mx-4 mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-gray-500">Donation</span>
          <span className="text-sm font-bold text-gray-900">£{base.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <span className="text-sm text-gray-500">Gift Aid</span>
          <span className="text-sm font-bold text-green-600">+£{giftAid.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
          <span className="text-sm text-gray-500">Receipt sent to</span>
          <span className="text-sm text-gray-400">{truncateEmail(email)}</span>
        </div>
      </div>

      {/* ── Back to fundraiser page ───────────────────────────────── */}
      <div className="mt-5 px-4">
        <Link
          href={`/fundraise/${fundraiserId}`}
          className="flex w-full items-center justify-center rounded-2xl bg-[#EC8900] py-4 text-base font-bold text-white transition-colors hover:bg-[#d47a00] active:scale-[0.99]"
        >
          Back to {fundraiserName}&apos;s Page
        </Link>
      </div>

      {/* ── Share via ────────────────────────────────────────────── */}
      <p className="mt-6 text-center text-xs font-semibold text-gray-400">Share via</p>

      <div className="mb-10 mt-3 flex items-start justify-center gap-6 px-4">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encodedMsg}`}
          target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-sm hover:opacity-90">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.522 5.83L.058 23.268a.748.748 0 0 0 .916.916l5.44-1.463A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.063-1.382l-.362-.215-3.233.87.884-3.232-.236-.375A9.884 9.884 0 0 1 2.1 12c0-5.463 4.437-9.9 9.9-9.9 5.463 0 9.9 4.437 9.9 9.9 0 5.463-4.437 9.9-9.9 9.9z" />
            </svg>
          </span>
          <span className="text-xs text-gray-500">WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2] shadow-sm hover:opacity-90">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.931-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </span>
          <span className="text-xs text-gray-500">Facebook</span>
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedMsg}`}
          target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black shadow-sm hover:opacity-90">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.742l7.736-8.849L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </span>
          <span className="text-xs text-gray-500">X</span>
        </a>

        {/* Copy Link */}
        <button onClick={handleCopy} className="flex flex-col items-center gap-1.5">
          <span className={`flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition-all ${copied ? "bg-green-500" : "bg-gray-100 hover:bg-gray-200"}`}>
            {copied ? (
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path strokeLinecap="round" d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
            )}
          </span>
          <span className="text-xs text-gray-500">{copied ? "Copied!" : "Copy Link"}</span>
        </button>
      </div>

    </div>
  );
}
