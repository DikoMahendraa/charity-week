import Link from "next/link";
import { ArrowLeft, Clock, Users, Heart } from "lucide-react";

// ─── Static campaign data ─────────────────────────────────────────────────────

interface CampaignData {
  slug:             string;
  title:            string;
  image:            string;
  lastDonation:     string;
  fundraiserCount:  number;
  donorCount:       number;
  raised:           number;
  goal:             number;
  story:            string;
  totalRaised:      string;
  raisedBy:         string;
  raisedOf:         string;
  giftAid:          string;
  onlineDonations:  string;
  offlineDonations: string;
}

const CAMPAIGNS: Record<string, CampaignData> = {
  "1": {
    slug:             "1",
    title:            "Peer to Peer Fundraising Campaign Name That Goes Over 3 lines maybe",
    image:            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    lastDonation:     "15m ago",
    fundraiserCount:  6,
    donorCount:       145,
    raised:           63139,
    goal:             60000,
    story:            `In a world where water is life, millions still face the harsh reality of inadequate access to clean and safe water sources. The "Provides Clean Water and Safe Water" charity stands as a beacon of hope, working tirelessly to implement sustainable water solutions that transform lives.\n\nIn a world where water is life, millions still face the harsh reality of inadequate access to clean and safe water sources. The "Provides Clean Water and Safe Water" charity stands as a beacon of hope, working tirelessly to implement sustainable water solutions that transform lives. In a world where water is life, millions still face the harsh reality of inadequate access to clean and safe water sources. The "Provides Clean Water and Safe Water" charity stands as a beacon of hope, working tirelessly to implement sustainable water solutions that transform lives.\n\nIn a world where water is life, millions still face the harsh reality of inadequate access to clean and safe water sources.`,
    totalRaised:      "$3,250.88",
    raisedBy:         "Ismael",
    raisedOf:         "$24,000",
    giftAid:          "$634.30",
    onlineDonations:  "$3,289.96",
    offlineDonations: "$0.00",
  },
  "2": {
    slug:             "2",
    title:            "Muslim Charity Run 2026 — Clean Water Campaign",
    image:            "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    lastDonation:     "2h ago",
    fundraiserCount:  12,
    donorCount:       291,
    raised:           42500,
    goal:             50000,
    story:            "Every drop of clean water changes a life. Join us for the Muslim Charity Run 2026 to bring safe water to families in need.\n\nYour support will fund wells, filtration systems, and hygiene education programmes that last generations.",
    totalRaised:      "$12,092.00",
    raisedBy:         "The community",
    raisedOf:         "$50,000",
    giftAid:          "$3,023.00",
    onlineDonations:  "$12,092.00",
    offlineDonations: "$0.00",
  },
};

function getCampaign(slug: string): CampaignData {
  return CAMPAIGNS[slug] ?? CAMPAIGNS["1"];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US");
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CampaignSlugPage({ params }: Props) {
  const { slug } = await params;
  const c = getCampaign(slug);
  const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));

  return (
    <div className="min-h-screen bg-white">

      {/* Back nav */}
      <div className="border-b border-gray-100 px-6 py-4">
        <Link
          href="/campaign/pages"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#EC8900] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-10">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900">{c.title}</h1>

            {/* Stats bar */}
            <div className="mt-5 flex items-center gap-5 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Last donation {c.lastDonation}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {c.fundraiserCount} Fundraisers
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                {c.donorCount} Donors
              </span>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-[#EC8900] transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-sm font-semibold text-gray-700">
                {fmt(c.raised)} raised of {fmt(c.goal)}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-5 flex gap-3">
              <Link
                href={`/fundraise/${slug}/donate`}
                className="rounded-lg bg-[#EC8900] px-6 py-3 text-sm font-bold text-white hover:bg-[#d47800] transition-colors"
              >
                Donate Now
              </Link>
              <button className="rounded-lg border border-[#EC8900] px-6 py-3 text-sm font-semibold text-[#EC8900] hover:bg-orange-50 transition-colors">
                Create Fundraising Page
              </button>
            </div>
          </div>

          {/* Campaign image */}
          <div className="h-56 w-72 shrink-0 overflow-hidden rounded-xl">
            <img src={c.image} alt={c.title} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* ── Story ────────────────────────────────────────────────── */}
        <div>
          <h2 className="mb-5 text-xl font-bold text-gray-900">Story</h2>
          <div className="space-y-4">
            {c.story.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-gray-600">{para}</p>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <button className="rounded-lg border border-[#EC8900] px-8 py-2.5 text-sm font-semibold text-[#EC8900] hover:bg-orange-50 transition-colors">
              View Full Story
            </button>
          </div>
        </div>

        {/* ── Donation summary ──────────────────────────────────────── */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="mb-5 text-base font-bold text-gray-900">Donation summary</h2>
          <div className="grid grid-cols-3 gap-6">
            {/* Total raised */}
            <div>
              <p className="text-xs font-semibold text-gray-500">Total raised</p>
              <p className="mt-2 text-sm font-semibold text-[#EC8900]">
                {c.raisedBy} has raised {c.totalRaised} of {c.raisedOf} in total
              </p>
              <p className="mt-1 text-xs font-semibold text-[#14BA6D]">+ {c.giftAid} Gift Aid</p>
              <p className="mt-3 text-xs text-gray-400 leading-relaxed">
                Charities pay a small fee for our service.{" "}
                <span className="cursor-pointer text-[#EC8900] underline">
                  Find out how much it is and what we do for it.
                </span>
              </p>
            </div>

            {/* Online donations */}
            <div>
              <p className="text-xs font-semibold text-gray-500">Online donations</p>
              <p className="mt-2 text-lg font-bold text-gray-900">{c.onlineDonations}</p>
            </div>

            {/* Offline donations */}
            <div>
              <p className="text-xs font-semibold text-gray-500">Offline donations</p>
              <p className="mt-2 text-lg font-bold text-gray-900">{c.offlineDonations}</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-6">
          {/* Org sign in */}
          <div className="mb-6 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EC8900]">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500">Org Sign In</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Use</span>
            </div>
            <span className="text-center text-gray-400">{"{Custom footer text}"}</span>
            <span>{"{Org name}"}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
