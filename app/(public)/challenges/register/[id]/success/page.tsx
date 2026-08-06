import Link from "next/link";
import { notFound } from "next/navigation";
import { CHALLENGES } from "../../../_components/challenges-data";
import StepHeader from "../../../_components/StepHeader";
import ShareButtons from "./ShareButtons";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SuccessPage({ params }: Props) {
  const { id } = await params;
  const challenge = CHALLENGES.find(c => String(c.id) === id);
  if (!challenge) notFound();

  const pageUrl = `/fundraise/${id}`;
  const goalFormatted = challenge.fundraisingGoal
    ? `$${challenge.fundraisingGoal.toLocaleString("en-US")}`
    : "$50,000";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F7F9FB] shadow-[0_0_48px_rgba(0,0,0,0.10)]">
        <StepHeader
          title="Let's share it to others"
          subtitle="Description"
          currentStep={3}
          totalSteps={3}
          backHref={`/challenges/register/${id}`}
        />

        <main className="px-4 pb-10 pt-4">
          {/* Success banner */}
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3.5">
            <p className="text-sm font-bold text-green-800">You are registered!</p>
            <p className="mt-0.5 text-xs text-green-700">
              You&apos;re registered for the {challenge.title}  and your page is live!
            </p>
          </div>

          {/* Challenge image */}
          <div className="mb-5 overflow-hidden rounded-2xl shadow-sm">
            <img
              src={challenge.image}
              alt={challenge.title}
              className="h-48 w-full object-cover"
            />
          </div>

          {/* Page title */}
          <h1 className="mb-3 text-lg font-extrabold text-gray-900">
            Register - {challenge.title}
          </h1>

          {/* Tags */}
          {challenge.tags && challenge.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {challenge.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Fundraising progress */}
          <p className="mb-6 text-sm text-gray-500">
            <span className="text-base font-extrabold text-gray-900">$0 Raised</span>
            {" "}of {goalFormatted} goal
          </p>

          {/* View fundraiser page */}
          <Link
            href={pageUrl}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#EC8900] py-3.5 text-sm font-bold text-[#EC8900] transition-colors hover:bg-orange-50"
          >
            View my fundraiser page
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Share section */}
          <p className="mb-4 text-sm font-semibold text-gray-500">Share via</p>
          <ShareButtons pageUrl={`https://iruk.org${pageUrl}`} pageTitle={challenge.title} />
        </main>
      </div>
    </div>
  );
}
