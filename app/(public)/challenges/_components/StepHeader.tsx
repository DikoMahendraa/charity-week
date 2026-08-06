"use client";

import { useRouter } from "next/navigation";

interface StepHeaderProps {
  title: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
  backHref?: string;
}

export default function StepHeader({
  title,
  subtitle,
  currentStep = 2,
  totalSteps  = 3,
  backHref    = "/challenges",
}: StepHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white px-4 pb-3 pt-4">
      {/* Back + title */}
      <button
        onClick={() => router.push(backHref)}
        className="mb-0.5 flex items-center gap-2 text-left"
      >
        <svg className="h-4 w-4 shrink-0 text-gray-800" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-base font-bold text-gray-900">{title}</span>
      </button>

      {subtitle && (
        <p className="mb-3 pl-6 text-xs text-gray-400">{subtitle}</p>
      )}

      {/* Progress bar */}
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: i < currentStep ? "#EC8900" : "#E5E7EB" }}
          />
        ))}
      </div>
    </header>
  );
}
