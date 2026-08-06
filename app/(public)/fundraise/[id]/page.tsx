import { notFound } from "next/navigation";
import { getFundraiser } from "./fundraiser-data";
import StatsCard from "./StatsCard";
import ShareButtons from "./ShareButtons";

interface Props {
  params: Promise<{ id: string }>;
}

function formatFull(n: number): string {
  return "£" + n.toLocaleString("en-GB");
}

export default async function FundraiserPage({ params }: Props) {
  const { id } = await params;
  const fundraiser = getFundraiser(id);
  if (!fundraiser) notFound();

  const {
    fundraiserName, challengeTitle, image,
    raised, goal, totalDonors, recentDonorsCount, daysLeft,
    story, recentDonors,
  } = fundraiser;

  const pct = Math.min(100, Math.round((raised / goal) * 100));
  const pageUrl = `https://iruk.org/fundraise/${id}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F7F9FB] shadow-[0_0_48px_rgba(0,0,0,0.10)]">

        {/* Hero image  bleeds to top edge, no header */}
        <div className="h-56 overflow-hidden">
          <img src={image} alt={challengeTitle} className="h-full w-full object-cover" />
        </div>

        {/* ── Stats card (clickable → dashboard) ───────────────── */}
        <StatsCard
          fundraiserId={id}
          fundraiserName={fundraiserName}
          challengeTitle={challengeTitle}
          raised={raised}
          goal={goal}
          pct={pct}
          totalDonors={totalDonors}
          daysLeft={daysLeft}
        />

        {/* ── Your story ────────────────────────────────────────── */}
        <div className="mx-4 mt-3 rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-extrabold text-gray-900">Your story</h2>
          <div className="flex flex-col gap-3">
            {story.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-gray-600">{para}</p>
            ))}
          </div>
        </div>

        {/* ── Recent donors ─────────────────────────────────────── */}
        <div className="mx-4 mt-3 rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900">Recent Donors</h2>
            <span className="text-xs font-semibold text-[#EC8900]">
              {recentDonorsCount.toLocaleString()} donors
            </span>
          </div>

          <ul className="flex flex-col divide-y divide-gray-50">
            {recentDonors.map(donor => (
              <li key={donor.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                {/* Avatar */}
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  <img
                    src={donor.avatar}
                    alt={donor.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Name + message */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900">{donor.name}</p>
                  <p className="truncate text-xs text-gray-400">
                    {donor.message}  {donor.timeAgo}
                  </p>
                </div>

                {/* Amount */}
                <p className="shrink-0 text-sm font-bold text-gray-900">
                  {formatFull(donor.amount)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Share ─────────────────────────────────────────────── */}
        <div className="px-4 pb-10 pt-5">
          <p className="mb-4 text-center text-sm font-semibold text-gray-400">Share via</p>
          <ShareButtons pageUrl={pageUrl} pageTitle={challengeTitle} />
        </div>

      </div>
    </div>
  );
}
