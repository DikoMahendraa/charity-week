import { notFound } from "next/navigation";
import Link         from "next/link";
import { getFundraiser } from "../../fundraiser-data";
import PaymentForm from "./PaymentForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PaymentPage({ params }: Props) {
  const { id } = await params;
  const fundraiser = getFundraiser(id);
  if (!fundraiser) notFound();

  const { challengeTitle } = fundraiser;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F7F9FB] shadow-[0_0_48px_rgba(0,0,0,0.10)]">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Link
              href={`/fundraise/${id}/donate`}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-base font-extrabold text-gray-900">{challengeTitle}</h1>
              <p className="text-xs text-gray-400">Description</p>
            </div>
          </div>

          {/* Two-step progress bar */}
          <div className="flex gap-1.5 px-4 pb-3">
            <div className="h-1 flex-1 rounded-full bg-[#EC8900]" />
            <div className="h-1 flex-1 rounded-full bg-[#EC8900]" />
          </div>
        </div>

        {/* Form */}
        <PaymentForm fundraiserId={id} challengeTitle={challengeTitle} />

      </div>
    </div>
  );
}
