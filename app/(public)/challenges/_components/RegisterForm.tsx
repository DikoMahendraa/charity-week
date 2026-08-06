"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Challenge } from "./ChallengeCard";
import PersonalDetailsSection from "./PersonalDetailsSection";
import ContactDetailsSection  from "./ContactDetailsSection";
import SafetySection          from "./SafetySection";
import PolicySection          from "./PolicySection";
import LinkPageBottomSheet    from "./LinkPageBottomSheet";

export interface RegisterFormData {
  // Personal
  title:         string;
  firstName:     string;
  surname:       string;
  dobDay:        string;
  dobMonth:      string;
  dobYear:       string;
  // Contact
  email:         string;
  phoneCode:     string;
  phone:         string;
  address:       string;
  postcode:      string;
  buildingNumber:string;
  addressLine1:  string;
  addressLine2:  string;
  townCity:      string;
  country:       string;
  // Safety
  medicalHistory:    string;
  medications:       string;
  acceptTerms:       boolean;
  // Photography
  consentPhotography:boolean;
}

const INITIAL: RegisterFormData = {
  title: "Mr", firstName: "", surname: "",
  dobDay: "01", dobMonth: "01", dobYear: "2000",
  email: "", phoneCode: "+44", phone: "",
  address: "", postcode: "", buildingNumber: "",
  addressLine1: "", addressLine2: "", townCity: "",
  country: "United Kingdom",
  medicalHistory: "", medications: "",
  acceptTerms: false, consentPhotography: false,
};

interface Props {
  challenge: Challenge;
}

const STEPS = [
  "Verifying payment…",
  "Creating your fundraising page…",
  "Sending confirmation email…",
  "Almost there…",
];

function LoadingOverlay({ step }: { step: string }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-[360px] overflow-hidden rounded-2xl bg-white p-6 shadow-2xl">
        {/* Animated ring */}
        <div className="mb-5 flex justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <svg className="absolute inset-0 animate-spin" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="#F3F4F6" strokeWidth="6" />
              <path
                d="M32 4a28 28 0 0 1 28 28"
                stroke="#EC8900"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl">💳</span>
          </div>
        </div>

        <p className="mb-1.5 text-center text-base font-bold text-gray-900">Processing</p>
        <p className="text-center text-sm text-gray-500 transition-all duration-500">{step}</p>

        {/* Progress dots */}
        <div className="mt-4 flex justify-center gap-1.5">
          {STEPS.map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s === step ? "w-6 bg-[#EC8900]" : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SuccessToast({ pageTitle, visible }: { pageTitle: string; visible: boolean }) {
  return (
    <div
      aria-live="polite"
      className={`fixed left-1/2 top-4 z-[60] w-[calc(100%-2rem)] max-w-[398px] -translate-x-1/2 rounded-2xl bg-white px-4 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.15)] ring-1 ring-gray-100 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
          <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900">Page linked!</p>
          <p className="mt-0.5 truncate text-xs text-gray-500">{pageTitle}</p>
          <p className="mt-0.5 text-xs text-gray-400">Your form has been filled in. Review and submit when ready.</p>
        </div>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{
            width: visible ? "0%" : "100%",
            transitionDuration: visible ? "3000ms" : "0ms",
            transitionTimingFunction: "linear",
          }}
        />
      </div>
    </div>
  );
}

export default function RegisterForm({ challenge }: Props) {
  const router = useRouter();
  const [form, setForm]               = useState<RegisterFormData>(INITIAL);
  const [sheetOpen, setSheetOpen]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStep, setLoadingStep]   = useState(0);
  const [toastTitle, setToastTitle]   = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (dismissTimer.current) clearTimeout(dismissTimer.current); };
  }, []);

  function showToast(pageTitle: string) {
    setToastTitle(pageTitle);
    setToastVisible(false);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setToastVisible(true);
        if (dismissTimer.current) clearTimeout(dismissTimer.current);
        dismissTimer.current = setTimeout(() => setToastVisible(false), 3200);
      })
    );
  }

  function handleChange(field: keyof RegisterFormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.acceptTerms) {
      alert("Please accept the event terms & safety briefing to continue.");
      return;
    }

    setIsSubmitting(true);
    setLoadingStep(0);

    // Simulate multi-step API call
    for (let i = 0; i < STEPS.length; i++) {
      setLoadingStep(i);
      await new Promise<void>(resolve => setTimeout(resolve, 900));
    }

    router.push(`/challenges/register/${challenge.id}/success`);
  }

  return (
    <>
      {isSubmitting && <LoadingOverlay step={STEPS[loadingStep]} />}
      <SuccessToast pageTitle={toastTitle} visible={toastVisible} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 pb-44 pt-4">
        {/* Event hero */}
        <div className="overflow-hidden rounded-2xl shadow-sm">
          <img
            src={challenge.image}
            alt={challenge.title}
            className="h-40 w-full object-cover"
          />
        </div>

        <PersonalDetailsSection data={form} onChange={handleChange} />
        <ContactDetailsSection  data={form} onChange={handleChange} />
        <SafetySection          data={form} onChange={handleChange} />
        <PolicySection          data={form} onChange={(field, value) => handleChange(field, value)} />

        {/* Have page already */}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="w-full rounded-xl border-2 border-[#EC8900] py-3.5 text-sm font-bold text-[#EC8900] transition-colors hover:bg-orange-50"
        >
          Have page already? Set challenge here
        </button>

        <LinkPageBottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onAssign={(data, pageTitle) => {
            setForm(prev => ({ ...prev, ...data }));
            setSheetOpen(false);
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              showToast(pageTitle);
            }, 320);
          }}
        />

        {/* Sticky pay footer */}
        <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-white px-4 pb-6 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="mb-3 flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Entry fee</span>
              <span className="font-semibold text-gray-900">£{challenge.fee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 pt-1 text-sm font-bold text-gray-900">
              <span>Total</span>
              <span>£{challenge.fee.toFixed(2)}</span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EC8900] py-4 text-sm font-bold text-white transition-colors hover:bg-[#d47a00] active:scale-[0.99] disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Processing payment…
              </>
            ) : (
              `Pay £${challenge.fee} & create my page`
            )}
          </button>
        </div>
      </form>
    </>
  );
}
