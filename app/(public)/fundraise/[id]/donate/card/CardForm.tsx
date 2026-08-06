"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* ── Zod schema ─────────────────────────────────────────────── */
const schema = z.object({
  name:       z.string().min(2),
  cardNumber: z.string().min(19),
  expiry:     z.string().regex(/^\d{2}\/\d{2}$/),
  cvc:        z.string().min(3).max(4),
  email:      z.string().email(),
});

type FormValues = z.infer<typeof schema>;

/* ── Input class helper ──────────────────────────────────────── */
function inputCls(err: boolean, extra = "") {
  const border = err
    ? "border-red-400 focus:border-red-500 focus:ring-red-400/20"
    : "border-gray-200 focus:border-[#EC8900] focus:ring-[#EC8900]/20";
  return `w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition-all ${border} ${extra}`;
}

/* ── Formatters ─────────────────────────────────────────────── */
function formatCard(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 16).match(/.{1,4}/g)?.join(" ") ?? "";
}

function formatExpiry(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

/* ── Main ────────────────────────────────────────────────────── */
export default function CardForm({
  fundraiserId, total,
}: {
  fundraiserId: string;
  total: number;
}) {
  const router = useRouter();
  const [showError,   setShowError]   = useState(false);
  const [showCvcHelp, setShowCvcHelp] = useState(false);

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", cardNumber: "", expiry: "", cvc: "", email: "" },
  });

  const cardNumber = watch("cardNumber");

  // Form is incomplete → show error UI
  function onError() {
    setShowError(true);
  }

  // Form is valid → navigate to success
  async function onSubmit(data: FormValues) {
    setShowError(false);
    await new Promise<void>(r => setTimeout(r, 1400));
    const params = new URLSearchParams({
      total: total.toFixed(2),
      email: data.email,
    });
    router.push(`/fundraise/${fundraiserId}/donate/success?${params.toString()}`);
  }

  function clearError() {
    if (showError) setShowError(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col gap-4 px-4 pb-36 pt-5">

      {/* ── Error banner ────────────────────────────────────────── */}
      {showError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-600">Payment didn't go through</p>
          <p className="mt-1 text-xs leading-relaxed text-red-500">
            Your card wasn't charged. Check the details or try another method.
          </p>
        </div>
      )}

      {/* ── Card fields ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm">

        {/* Name on Card */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Name on Card</label>
          <input
            {...register("name")}
            type="text"
            autoComplete="cc-name"
            placeholder="Alex Morgan"
            onChange={e => { register("name").onChange(e); clearError(); }}
            className={inputCls(showError && !!errors.name)}
          />
        </div>

        {/* Card Number */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Card Number</label>
          <div className="relative">
            <input
              {...register("cardNumber")}
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder=".... .... .... ...."
              maxLength={19}
              onChange={e => {
                setValue("cardNumber", formatCard(e.target.value), { shouldValidate: false });
                clearError();
              }}
              className={inputCls(showError && !!errors.cardNumber, "pr-20")}
            />
            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
              {cardNumber && (
                <button
                  type="button"
                  onClick={() => { setValue("cardNumber", ""); clearError(); }}
                  className="text-gray-300 hover:text-gray-500"
                  aria-label="Clear card number"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </button>
              )}
              <svg className="h-5 w-8 text-gray-300" viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="1" y="1" width="30" height="18" rx="3" />
                <path d="M1 7h30" />
                <rect x="4" y="11" width="6" height="4" rx="1" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </div>
          {showError && errors.cardNumber && (
            <p className="text-xs text-red-500">Card number is wrong. Please try again</p>
          )}
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">Expiry Date</label>
            <input
              {...register("expiry")}
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              maxLength={5}
              onChange={e => {
                setValue("expiry", formatExpiry(e.target.value), { shouldValidate: false });
                clearError();
              }}
              className={inputCls(showError && !!errors.expiry)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-600">CVC</label>
            <div className="relative">
              <input
                {...register("cvc")}
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                maxLength={4}
                onChange={e => {
                  setValue("cvc", e.target.value.replace(/\D/g, "").slice(0, 4), { shouldValidate: false });
                  clearError();
                }}
                className={inputCls(showError && !!errors.cvc, "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowCvcHelp(v => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-300 hover:text-gray-500"
                aria-label="What is CVC?"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
                </svg>
              </button>

              {showCvcHelp && (
                <div className="absolute bottom-full right-0 z-10 mb-2 w-52 rounded-xl bg-gray-800 p-3 text-xs leading-relaxed text-white shadow-lg">
                  The 3-4 digit security code on the back (or front) of your card.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email Receipt */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600">Email Receipt</label>
          <input
            {...register("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="alex@example.com"
            onChange={e => { register("email").onChange(e); clearError(); }}
            className={inputCls(showError && !!errors.email)}
          />
        </div>

      </div>

      {/* ── Sticky CTA ──────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-white px-4 pb-6 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-[#EC8900] py-4 text-base font-bold text-white transition-all hover:bg-[#d47a00] active:scale-[0.99] disabled:opacity-75"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Processing…
            </span>
          ) : (
            `Continue to Donate £${total.toFixed(2)}`
          )}
        </button>
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure 256-bit SSL encrypted payment
        </p>
      </div>
    </form>
  );
}
