import ChallengesNavbar from "./_components/ChallengesNavbar";
import ChallengesList from "./_components/ChallengesList";
import { CHALLENGES } from "./_components/challenges-data";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800&h=400&fit=crop";

export default function ChallengesPage() {
  return (
    /* Outer page  gray canvas on desktop so the centered column stands out */
    <div className="min-h-screen bg-gray-100">
      {/* Phone-width column, centered on all screen sizes */}
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] bg-white shadow-[0_0_48px_rgba(0,0,0,0.10)]">
        <ChallengesNavbar currentStep={1} totalSteps={3} />

        <main className="px-4 pb-24 pt-4">
          {/* Hero image */}
          <div className="mb-5 overflow-hidden rounded-2xl shadow-sm">
            <img
              src={HERO_IMAGE}
              alt="Take on a Challenge"
              className="h-44 w-full object-cover"
            />
          </div>

          {/* Section header */}
          <div className="mb-5">
            <h1 className="text-xl font-extrabold text-gray-900">
              Take on a Challenge
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Hit register and take on a challenge in aid of orphans and children!
            </p>
          </div>

          {/* Challenges list */}
          <ChallengesList challenges={CHALLENGES} initialCount={4} />
        </main>
      </div>
    </div>
  );
}
