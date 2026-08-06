import { notFound }   from "next/navigation";
import { getFundraiser } from "../../fundraiser-data";
import SuccessContent  from "./SuccessContent";

interface Props {
  params:      Promise<{ id: string }>;
  searchParams: Promise<{ total?: string; email?: string }>;
}

export default async function SuccessPage({ params, searchParams }: Props) {
  const { id }           = await params;
  const { total, email } = await searchParams;

  const fundraiser = getFundraiser(id);
  if (!fundraiser) notFound();

  const { fundraiserName, raised, goal } = fundraiser;
  const totalAmount = parseFloat(total ?? "0") || 0;
  const pageUrl     = `https://iruk.org/fundraise/${id}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F7F9FB] shadow-[0_0_48px_rgba(0,0,0,0.10)]">
        <SuccessContent
          fundraiserId={id}
          fundraiserName={fundraiserName}
          raised={raised}
          goal={goal}
          pageUrl={pageUrl}
          email={email ?? ""}
          total={totalAmount}
        />
      </div>
    </div>
  );
}
