"use client";

import { useState } from "react";
import BottomSheet from "./BottomSheet";
import type { RegisterFormData } from "./RegisterForm";

interface Registrant extends Omit<RegisterFormData, "acceptTerms" | "consentPhotography"> { }

interface ExistingPage {
  id: number;
  title: string;
  image: string;
  raised: number;
  goal: number;
  donors: number;
  daysLeft: number;
  linked: boolean;
  registrant: Registrant;
}

const EXISTING_PAGES: ExistingPage[] = [
  {
    id: 1,
    title: "Help People in Indonesia Built Well",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=300&fit=crop",
    raised: 1247893,
    goal: 1600000,
    donors: 3412,
    daysLeft: 12,
    linked: true,
    registrant: {
      title: "Mr",
      firstName: "Adam",
      surname: "Hassan",
      dobDay: "14",
      dobMonth: "03",
      dobYear: "1990",
      email: "adam.hassan@email.com",
      phoneCode: "+44",
      phone: "7712 345678",
      address: "45 Green Lane, London",
      postcode: "E1 6RF",
      buildingNumber: "45",
      addressLine1: "Green Lane",
      addressLine2: "",
      townCity: "London",
      country: "United Kingdom",
      medicalHistory: "None",
      medications: "None",
    },
  },
  {
    id: 2,
    title: "Run for Clean Water  Africa 2026",
    image: "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=600&h=300&fit=crop",
    raised: 1247893,
    goal: 1600000,
    donors: 3412,
    daysLeft: 12,
    linked: false,
    registrant: {
      title: "Mrs",
      firstName: "Sara",
      surname: "Ali",
      dobDay: "22",
      dobMonth: "07",
      dobYear: "1985",
      email: "sara.ali@email.com",
      phoneCode: "+44",
      phone: "7899 123456",
      address: "12 Oak Street, Manchester",
      postcode: "M1 2AB",
      buildingNumber: "12",
      addressLine1: "Oak Street",
      addressLine2: "Flat 3",
      townCity: "Manchester",
      country: "United Kingdom",
      medicalHistory: "Mild asthma  inhaler carried at all times",
      medications: "Salbutamol inhaler",
    },
  },
];

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `£${(n / 1_000).toFixed(0)}K`;
  return `£${n}`;
}

function formatFull(n: number): string {
  return "£" + n.toLocaleString("en-GB");
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function PageCard({
  page,
  loadingId,
  onAssign,
}: {
  page: ExistingPage;
  loadingId: number | null;
  onAssign: (page: ExistingPage) => void;
}) {
  const pct = Math.min(100, Math.round((page.raised / page.goal) * 100));
  const isLoading = loadingId === page.id;
  const isOther = loadingId !== null && loadingId !== page.id;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      {/* Image */}
      <div className="relative">
        <img src={page.image} alt={page.title} className="h-44 w-full object-cover" />
        {page.linked && (
          <span className="absolute right-3 top-3 rounded-full bg-green-500 px-2.5 py-1 text-xs font-bold text-white">
            Linked
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 text-sm font-bold text-gray-900">{page.title}</h3>
        <p className="text-2xl font-extrabold text-gray-900">{formatFull(page.raised)}</p>
        <p className="mb-3 text-xs text-gray-400">raised of {formatFull(page.goal)} goal</p>

        {/* Progress bar */}
        <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-[#EC8900]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className="font-semibold text-[#EC8900]">{pct}% completed</span>
          <span className="text-gray-400">Goal: {formatAmount(page.goal)}</span>
        </div>

        {/* Stats */}
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
          onClick={() => onAssign(page)}
          disabled={isLoading || isOther}
          className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200 ${isLoading
              ? "bg-[#EC8900] opacity-90"
              : isOther
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-[#EC8900] hover:bg-[#d47a00] active:scale-[0.99]"
            }`}
        >
          {isLoading ? (
            <>
              <Spinner />
              Linking page…
            </>
          ) : (
            "Re-assign Page"
          )}
        </button>
      </div>
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  onAssign: (data: Partial<RegisterFormData>, pageTitle: string) => void;
}

export default function LinkPageBottomSheet({ open, onClose, onAssign }: Props) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function handleAssign(page: ExistingPage) {
    setLoadingId(page.id);
    await new Promise<void>(resolve => setTimeout(resolve, 1500));
    setLoadingId(null);
    onAssign(page.registrant, page.title);
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Link your existing page">
      <div className="flex flex-col gap-4 p-4 pb-6">
        {EXISTING_PAGES.map(page => (
          <PageCard
            key={page.id}
            page={page}
            loadingId={loadingId}
            onAssign={handleAssign}
          />
        ))}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-white px-4 py-4">
        <button
          onClick={onClose}
          disabled={loadingId !== null}
          className="w-full rounded-xl border-2 border-[#EC8900] py-3.5 text-sm font-bold text-[#EC8900] transition-colors hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create New Page Instead
        </button>
      </div>
    </BottomSheet>
  );
}
