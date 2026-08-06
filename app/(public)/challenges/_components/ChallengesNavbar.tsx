"use client";

import { useState } from "react";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}

interface ChallengesNavbarProps {
  logoText?: string;
  navLinks?: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  /** 1-based index of the active step (for the progress bar) */
  currentStep?: number;
  totalSteps?: number;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home",       href: "/microsite"       },
  { label: "About",      href: "/microsite/about" },
  { label: "Challenges", href: "/challenges"      },
  { label: "FAQ",        href: "/microsite/faq"   },
];

export default function ChallengesNavbar({
  logoText    = "CW",
  navLinks    = NAV_LINKS,
  ctaLabel    = "Donate Now",
  ctaHref     = "/donate",
  currentStep = 1,
  totalSteps  = 3,
}: ChallengesNavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Main bar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EC8900] shadow-sm md:h-12 md:w-12">
            <span className="text-sm font-black text-white md:text-base">{logoText}</span>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white"
        >
          <span className="flex flex-col gap-[5px]">
            <span className={`block h-0.5 w-5 bg-gray-700 transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-gray-700 transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-gray-700 transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {/* Progress bar (mobile step indicator) */}
      <div className="flex gap-1 px-4 pb-3 md:hidden">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: i < currentStep ? "#EC8900" : "#E5E7EB" }}
          />
        ))}
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#EC8900]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-[#EC8900] px-4 py-2.5 text-center text-sm font-bold text-white"
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
