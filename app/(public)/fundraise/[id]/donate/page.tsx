import { notFound } from "next/navigation";
import Link          from "next/link";
import { getFundraiser } from "../fundraiser-data";
import DonationForm from "./DonationForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DonatePage({ params }: Props) {
  const { id } = await params;
  const fundraiser = getFundraiser(id);
  if (!fundraiser) notFound();

  const { fundraiserName, challengeTitle, image, raised, goal, totalDonors, daysLeft } = fundraiser;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F7F9FB] shadow-[0_0_48px_rgba(0,0,0,0.10)]">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-3.5 shadow-sm">
          <Link
            href={`/fundraise/${id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-base font-extrabold text-gray-900">Make a Donation</h1>
        </div>

        {/* Form */}
        <DonationForm
          fundraiserId={id}
          fundraiserName={fundraiserName}
          image={image}
          challengeTitle={challengeTitle}
          raised={raised}
          goal={goal}
          totalDonors={totalDonors}
          daysLeft={daysLeft}
        />
      </div>
    </div>
  );
}
