"use client";

import dynamic from "next/dynamic";

// Lottie must be client-only (no SSR)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface Props {
  // Pass your lottie JSON via this prop, e.g. import animationData from "./donation.json"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationData?: any;
  loop?: boolean;
  className?: string;
}

export default function LottiePlayer({ animationData, loop = true, className = "" }: Props) {
  if (!animationData) {
    // Placeholder shown until the real lottie file is wired up
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
        <div className="flex flex-col items-center gap-3 text-indigo-300">
          <svg className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 80 80">
            {/* heart */}
            <path d="M40 68 C20 52 8 42 8 28 C8 18 16 10 26 10 C32 10 37 13 40 17 C43 13 48 10 54 10 C64 10 72 18 72 28 C72 42 60 52 40 68Z" strokeLinecap="round" strokeLinejoin="round" />
            {/* coin */}
            <circle cx="40" cy="12" r="7" />
            <path d="M37 12h6M40 9v6" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-indigo-400">Lottie animation placeholder</p>
        </div>
      </div>
    );
  }

  return <Lottie animationData={animationData} loop={loop} className={className} />;
}
