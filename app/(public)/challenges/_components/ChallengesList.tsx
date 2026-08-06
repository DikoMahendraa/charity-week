"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ChallengeCard, { type Challenge } from "./ChallengeCard";

interface ChallengesListProps {
  challenges: Challenge[];
  /** How many cards to show initially */
  initialCount?: number;
}

export default function ChallengesList({ challenges, initialCount = 4 }: ChallengesListProps) {
  const [showAll, setShowAll] = useState(false);

  const visible   = showAll ? challenges : challenges.slice(0, initialCount);
  const remaining = challenges.length - initialCount;

  return (
    <section className="relative pb-20">
      <div className="flex flex-col gap-3">
        {visible.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>

      {/* Sticky "show more" pill at bottom of the phone column */}
      {!showAll && remaining > 0 && (
        <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-lg ring-1 ring-gray-200 whitespace-nowrap"
          >
            Show {remaining} more challenge{remaining !== 1 ? "s" : ""}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      )}
    </section>
  );
}
