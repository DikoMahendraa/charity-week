"use client";

import Image              from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, KeyboardEvent, ClipboardEvent, Suspense } from "react";

const CODE_LENGTH = 4;

function VerifyContent() {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const email       = searchParams.get("email") ?? "";

  const [digits,      setDigits]      = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [submitting,  setSubmitting]  = useState(false);
  const [resendCooldown, setResend]   = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function focusAt(i: number) { inputs.current[i]?.focus(); }

  function handleChange(i: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next  = [...digits];
    next[i]     = digit;
    setDigits(next);
    if (digit && i < CODE_LENGTH - 1) focusAt(i + 1);
  }

  function handleKey(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) focusAt(i - 1);
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const text   = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    const filled = text.split("").concat(Array(CODE_LENGTH).fill("")).slice(0, CODE_LENGTH);
    setDigits(filled);
    const lastFilled = Math.min(text.length, CODE_LENGTH - 1);
    focusAt(lastFilled);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setResend(30);
    const id = setInterval(() => {
      setResend(v => { if (v <= 1) { clearInterval(id); return 0; } return v - 1; });
    }, 1000);
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length < CODE_LENGTH) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}`);
  }

  const complete = digits.every(d => d !== "");

  return (
    <div className="mx-auto flex min-h-screen max-w-[400px] flex-col px-6">

      {/* Logo */}
      <div className="flex items-center gap-2 pt-10">
        <Image src="/assets/svg/iruk-logo.svg" alt="IRUK" width={28} height={34} />
        <span className="text-base font-extrabold text-gray-900">IRUK</span>
      </div>

      {/* Progress bar: step 2 of 2 */}
      <div className="mt-4 flex gap-1.5">
        <div className="h-1 flex-1 rounded-full bg-[#EC8900]" />
        <div className="h-1 flex-1 rounded-full bg-[#EC8900]" />
      </div>

      {/* Heading */}
      <div className="mt-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Enter Verification Code</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
          We&apos;ve sent a {CODE_LENGTH}-digit code to your email.
          Please enter it below to continue.
        </p>
      </div>

      {/* Spam warning */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        <p className="text-xs leading-relaxed text-amber-700">
          Please check your spam folders to get our OTP codes.
        </p>
      </div>

      {/* OTP inputs */}
      <div className="mt-6 flex justify-center gap-4">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
            onPaste={handlePaste}
            className="h-16 w-16 rounded-xl border border-gray-200 bg-white text-center text-lg font-bold text-gray-900 shadow-sm outline-none transition-all focus:border-[#EC8900] focus:ring-2 focus:ring-[#EC8900]/20"
          />
        ))}
      </div>

      {/* Resend */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="font-bold text-[#EC8900] disabled:opacity-50"
        >
          {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : "Resend"}
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* CTA */}
      <div className="pb-10 pt-4">
        <button
          onClick={handleVerify}
          disabled={!complete || submitting}
          className="w-full rounded-2xl bg-[#EC8900] py-4 text-base font-bold text-white transition-colors hover:bg-[#d47a00] disabled:opacity-50"
        >
          {submitting ? "Verifying…" : "Verify"}
        </button>
      </div>

    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
