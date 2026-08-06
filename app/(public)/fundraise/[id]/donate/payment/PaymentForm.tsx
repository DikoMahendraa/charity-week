"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDonationStore } from "@/lib/stores/donationStore";

/* ── helpers ─────────────────────────────────────────────────── */
function fmt(n: number) { return "£" + n.toFixed(2); }

/* ── Checkbox row ─────────────────────────────────────────────── */
function CheckRow({
  id, checked, onChange, label, orange = false,
}: {
  id: string; checked: boolean; onChange: (v: boolean) => void;
  label: string; orange?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${orange
          ? "border-orange-200 bg-orange-50"
          : "border-gray-100 bg-white"
        }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 cursor-pointer accent-[#EC8900]"
      />
      <span className={`text-sm font-semibold ${orange ? "text-gray-800" : "text-gray-700"}`}>
        {label}
      </span>
    </label>
  );
}

/* ── Main ─────────────────────────────────────────────────────── */
interface Props {
  fundraiserId: string;
  challengeTitle: string;
}

export default function PaymentForm({ fundraiserId, challengeTitle }: Props) {
  const router = useRouter();
  const store = useDonationStore();
  const base = store.baseAmount();

  // local UI state
  const [tipPct, setTipPct] = useState(15);
  const [giftAid, setGiftAid] = useState(false);
  const [coverFees, setCoverFees] = useState(true);
  const [dedicate, setDedicate] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  // derived amounts
  const tipAmount = Math.round(base * (tipPct / 100) * 100) / 100;
  const processingFee = Math.round(base * 0.05 * 100) / 100;
  const total = Math.round((base + (coverFees ? processingFee : 0)) * 100) / 100;
  const giftAidTotal = Math.round(base * 1.25 * 100) / 100;
  const sliderPct = (tipPct / 30) * 100;

  function handlePay(method: string) {
    if (method === "card") {
      router.push(`/fundraise/${fundraiserId}/donate/card?total=${total.toFixed(2)}`);
    } else {
      router.push(`/fundraise/${fundraiserId}/donate/success`);
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-10 pt-4">

      {/* ── Tip slider ──────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm font-bold text-gray-800">
          Supercharge your giving to make a greater impact!
        </p>
        <p className="mt-1 text-xs leading-relaxed text-gray-400">
          Thanks to donor who leave an optional amount here, IRUK can continue
          to offer amazing free tech
        </p>

        <p className="mt-4 text-sm font-bold text-[#EC8900]">
          {fmt(tipAmount)} ({tipPct}%)
        </p>

        <div className="mt-2 px-1">
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={tipPct}
            onChange={e => setTipPct(Number(e.target.value))}
            className="w-full cursor-pointer appearance-none rounded-full
              [&::-webkit-slider-runnable-track]:h-1.5
              [&::-webkit-slider-runnable-track]:rounded-full
              [&::-webkit-slider-thumb]:mt-[-7px]
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#EC8900]
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:ring-2
              [&::-webkit-slider-thumb]:ring-white"
            style={{
              background: `linear-gradient(to right, #EC8900 ${sliderPct}%, #E5E7EB ${sliderPct}%)`,
            }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>0%</span>
          <span>30%</span>
        </div>
      </div>

      {/* ── Gift Aid ────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-extrabold text-gray-900">Boost it by 25% - free</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
          With Gift Aid, the UK government will match 25p for every £1 you donate,
          at absolutely no extra cost to you.
        </p>

        {/* Boost card */}
        <div className="mt-4 flex items-start gap-3 rounded-xl bg-green-50 p-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-extrabold text-white">
            +25%
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              Turn {fmt(base)} into {fmt(giftAidTotal)}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              This match goes directly to help those in need.
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <label className="mt-4 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={giftAid}
            onChange={e => setGiftAid(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#EC8900]"
          />
          <span className="text-sm font-bold text-gray-800">Yes, I am a UK taxpayer</span>
        </label>

        {/* Legal */}
        <p className="mt-3 text-xs leading-relaxed text-gray-400">
          I want to Gift Aid this donation and any I've made in the past 4 years.
          I understand that if I pay less Income Tax and/or Capital Gains Tax than
          the amount of Gift Aid claimed on all my donations in that tax year, it is
          my responsibility to pay any difference.
        </p>
        <p className="mt-2 text-xs italic text-gray-400">(declaration wording: IRUK legal)</p>
      </div>

      {/* ── Cover transaction fees ───────────────────────────────── */}
      <CheckRow
        id="coverFees"
        checked={coverFees}
        onChange={setCoverFees}
        label="Cover transactions fees"
        orange={coverFees}
      />

      {/* ── Order summary ────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {/* Campaign header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
            <svg className="h-5 w-5 text-[#EC8900]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-extrabold text-gray-900">{challengeTitle}</p>
            <p className="text-xs text-gray-400">Entry Registration Fee</p>
          </div>
        </div>

        {/* Line items */}
        <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Registration fee</span>
            <span className="font-semibold text-gray-900">{fmt(base)}</span>
          </div>

          {coverFees && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing fee (5%)</span>
              <span className="font-semibold text-gray-900">{fmt(processingFee)}</span>
            </div>
          )}

          <div className="flex justify-between border-t border-gray-100 pt-2.5">
            <span className="text-base font-bold text-gray-900">Total</span>
            <span className="text-xl font-extrabold text-gray-900">{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* ── Optional extras ─────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5">
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4">
          <input
            type="checkbox"
            checked={dedicate}
            onChange={e => setDedicate(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-[#EC8900]"
          />
          <span className="text-sm font-semibold text-gray-700">
            Dedicate my donation in honor or in memory of someone
          </span>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
          <input
            type="checkbox"
            checked={subscribe}
            onChange={e => setSubscribe(e.target.checked)}
            className="h-5 w-5 shrink-0 cursor-pointer rounded accent-[#EC8900]"
          />
          <span className="text-sm font-semibold text-gray-700">Subscribe to our mailing list</span>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={e => setAnonymous(e.target.checked)}
            className="h-5 w-5 shrink-0 cursor-pointer rounded accent-[#EC8900]"
          />
          <span className="text-sm font-semibold text-gray-700">Keep my donations as anonymous</span>
        </label>
      </div>

      {/* ── Payment buttons ─────────────────────────────────────── */}
      <div className="mt-2 flex flex-col gap-3">
        {/* Apple Pay */}
        <button
          onClick={() => handlePay("apple")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.35c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 4.04zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-base font-bold">Pay</span>
        </button>

        {/* Google Pay */}
        <button
          onClick={() => handlePay("google")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-4 font-bold text-gray-800 shadow-sm transition-colors hover:bg-gray-50 active:scale-[0.99]"
        >
          {/* Google G logo */}
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-base font-bold">Pay</span>
        </button>

        {/* Card */}
        <button
          onClick={() => handlePay("card")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#EC8900] py-4 text-base font-bold text-white transition-colors hover:bg-[#d47a00] active:scale-[0.99]"
        >
          Pay with Debit/Credit Card
        </button>

        {/* SSL note */}
        <p className="flex items-center justify-center gap-1.5 pb-4 text-xs text-gray-400">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure 256-bit SSL encrypted payment
        </p>
      </div>

    </div>
  );
}
