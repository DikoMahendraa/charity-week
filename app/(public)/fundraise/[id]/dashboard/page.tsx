import Link from "next/link";
import { notFound } from "next/navigation";
import { getFundraiser } from "../fundraiser-data";
import DashboardClient from "./DashboardClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: Props) {
  const { id } = await params;
  const fundraiser = getFundraiser(id);
  if (!fundraiser) notFound();

  const { fundraiserName, challengeTitle, dashboard, recentDonors } = fundraiser;
  const publicUrl = `/fundraise/${id}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F7F9FB] shadow-[0_0_48px_rgba(0,0,0,0.10)]">

        {/* Header */}
        <div className="px-4 pb-4 pt-5">
          <Link
            href={publicUrl}
            className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900">Your Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-400">See how you&apos;re doing  and climb higher</p>
        </div>

        {/* Tabbed content */}
        <div className="px-4 pb-10">
          <DashboardClient
            fundraiserId={id}
            fundraiserName={fundraiserName}
            challengeTitle={challengeTitle}
            dashboard={dashboard}
            recentDonors={recentDonors}
            publicUrl={publicUrl}
          />
        </div>

      </div>
    </div>
  );
}
