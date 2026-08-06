import { notFound } from "next/navigation";
import Link from "next/link";
import { getFundraiser } from "../../fundraiser-data";
import CardForm from "./CardForm";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ total?: string }>;
}

export default async function CardPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { total } = await searchParams;

  const fundraiser = getFundraiser(id);
  if (!fundraiser) notFound();

  const totalAmount = parseFloat(total ?? "0") || 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F7F9FB] shadow-[0_0_48px_rgba(0,0,0,0.10)]">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-3.5 shadow-sm">
          <Link
            href={`/fundraise/${id}/donate/payment`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-base font-extrabold text-gray-900">Pay with Credit/Debit Card</h1>
        </div>

        {/* Form */}
        <CardForm fundraiserId={id} total={totalAmount} />

      </div>
    </div>
  );
}
