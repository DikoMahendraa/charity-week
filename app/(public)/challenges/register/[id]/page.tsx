import { notFound }   from "next/navigation";
import { CHALLENGES } from "../../_components/challenges-data";
import StepHeader     from "../../_components/StepHeader";
import RegisterForm   from "../../_components/RegisterForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RegisterPage({ params }: Props) {
  const { id } = await params;
  const challenge = CHALLENGES.find(c => String(c.id) === id);
  if (!challenge) notFound();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-[#F7F9FB] shadow-[0_0_48px_rgba(0,0,0,0.10)]">
        <StepHeader
          title={`Register - ${challenge.title}`}
          subtitle="Description"
          currentStep={2}
          totalSteps={3}
          backHref="/challenges"
        />
        <RegisterForm challenge={challenge} />
      </div>
    </div>
  );
}
