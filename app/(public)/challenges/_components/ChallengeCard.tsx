import Link from "next/link";

export type SpotStatus = "available" | "limited" | "few" | "full";

export interface Challenge {
  id: string | number;
  title: string;
  image: string;
  date: string;
  location: string;
  fee: number;
  spotsLeft: number | null; // null = full
  status: SpotStatus;
  registerHref?: string;
  tags?: string[];
  fundraisingGoal?: number;
}

function SpotsBadge({ status, spotsLeft }: { status: SpotStatus; spotsLeft: number | null }) {
  if (status === "full") {
    return (
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
        Full
      </span>
    );
  }

  const config = {
    available: { bg: "bg-green-50",  text: "text-green-700",  label: `${spotsLeft}+ spots`  },
    limited:   { bg: "bg-amber-50",  text: "text-amber-700",  label: `${spotsLeft} spots left` },
    few:       { bg: "bg-red-50",    text: "text-red-600",    label: `${spotsLeft} spots left` },
  }[status];

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { title, image, date, location, fee, spotsLeft, status, registerHref = `/challenges/register/${challenge.id}` } = challenge;
  const isFull = status === "full";

  return (
    <div className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 md:gap-4 md:p-4">
      {/* Image */}
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl md:h-36 md:w-36">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-orange-50 text-3xl">
            🏃
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          {/* Title + badge */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold leading-snug text-gray-900 md:text-base">
              {title}
            </h3>
            <SpotsBadge status={status} spotsLeft={spotsLeft} />
          </div>

          {/* Date */}
          <div className="mb-1 flex items-center gap-1.5 text-xs text-gray-500 md:text-sm">
            <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>{date}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 md:text-sm">
            <svg className="h-3.5 w-3.5 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M12 21s-6-6.686-6-11a6 6 0 1 1 12 0c0 4.314-6 11-6 11z" />
              <circle cx="12" cy="10" r="2" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="mt-3">
          {/* Fee */}
          <p className="mb-2 text-base font-bold text-gray-900 md:text-lg">
            £{fee} <span className="text-xs font-medium text-gray-400">entry fee</span>
          </p>

          {/* Register button */}
          <Link
            href={isFull ? "#" : registerHref}
            aria-disabled={isFull}
            className={`block rounded-xl py-2 text-center text-sm font-bold transition-colors md:py-2.5 ${
              isFull
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-[#EC8900] text-white hover:bg-[#d47a00]"
            }`}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
