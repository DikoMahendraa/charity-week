export interface Donor {
  id:          number;
  name:        string;
  message:     string; // "Zakat" or a quoted message
  timeAgo:     string;
  amount:      number;
  avatar:      string;
  isGiftAid?:  boolean;
  isAnonymous?:boolean;
}

export interface FundraiserPage {
  id:       number;
  title:    string;
  subtitle: string;
  editHref: string;
}

export interface DashboardData {
  raised:             number; // personal fundraising page raised (£)
  targetPct:          number; // % of personal goal reached
  donationsCount:     number; // number of donations on their page
  leaderboardRank:    number; // rank within leaderboard group
  leaderboardGroup:   string; // group name e.g. "Imperial ISOC"
  amountBehind:       number; // £ behind the next rank
  totalDonors:        number; // total donors for the "X donors" label
  allDonationsCount:  number; // for "See All (X) Donations"
  giftAidAmount:      number; // total GiftAid eligible amount
  giftAidGifts:       number; // number of GiftAid eligible gifts
  pages:              FundraiserPage[];
}

export interface Fundraiser {
  id:                 string;
  fundraiserName:     string;
  challengeTitle:     string;
  image:              string;
  raised:             number;
  goal:               number;
  totalDonors:        number;
  recentDonorsCount:  number;
  daysLeft:           number;
  story:              string;
  recentDonors:       Donor[];
  dashboard:          DashboardData;
}

const FUNDRAISERS: Record<string, Fundraiser> = {
  "1": {
    id:                "1",
    fundraiserName:    "Aisha",
    challengeTitle:    "Register - CW 10k Run",
    image:             "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=500&fit=crop",
    raised:            1247893,
    goal:              1600000,
    totalDonors:       3412,
    recentDonorsCount: 1232,
    daysLeft:          12,
    story: `In a world where water is life, millions still face the harsh reality of inadequate access to clean and safe water sources. The "Provides Clean Water and Safe Water" charity stands as a beacon of hope, working tirelessly to implement sustainable water solutions that transform lives.

Your support on our donation platform directly fuels projects that build wells, establish water purification systems, and educate communities on proper water management. Every dollar you donate is a drop that ripples across communities, fostering health, sanitation, and economic empowerment.

By contributing to this cause, you become an integral part of a global movement dedicated to eradicating waterborne diseases, improving overall health, and empowering communities to break free from the shackles of water scarcity. We believe that everyone, regardless of location or circumstance, deserves the basic human right to clean and safe water.`,
    recentDonors: [
      {
        id:         1,
        name:       "Sarah M.",
        message:    "Zakat",
        timeAgo:    "2m ago",
        amount:     2450,
        avatar:     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
        isGiftAid:  true,
      },
      {
        id:         2,
        name:       "Ahmed K.",
        message:    '"Goodluck!"',
        timeAgo:    "2m ago",
        amount:     1820,
        avatar:     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
        isGiftAid:  true,
      },
      {
        id:      3,
        name:    "James T.",
        message: "Zakat",
        timeAgo: "2m ago",
        amount:  1450,
        avatar:  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      },
      {
        id:         4,
        name:       "Fatima R.",
        message:    '"Goodluck!"',
        timeAgo:    "2m ago",
        amount:     1120,
        avatar:     "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
        isGiftAid:  true,
      },
      {
        id:          5,
        name:        "David L.",
        message:     '"Goodluck!"',
        timeAgo:     "2m ago",
        amount:      890,
        avatar:      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
        isAnonymous: false,
      },
    ],
    dashboard: {
      raised:            3412,
      targetPct:         57,
      donationsCount:    23,
      leaderboardRank:   4,
      leaderboardGroup:  "Imperial ISOC",
      amountBehind:      120,
      totalDonors:       1232,
      allDonationsCount: 20,
      giftAidAmount:     610,
      giftAidGifts:      14,
      pages: [
        { id: 1, title: "Page Title", subtitle: "Aisha's Charity Week Page", editHref: "#" },
        { id: 2, title: "Page Title", subtitle: "Aisha's Charity Week Page", editHref: "#" },
        { id: 3, title: "Page Title", subtitle: "Aisha's Charity Week Page", editHref: "#" },
        { id: 4, title: "Page Title", subtitle: "Aisha's Charity Week Page", editHref: "#" },
        { id: 5, title: "Page Title", subtitle: "Aisha's Charity Week Page", editHref: "#" },
        { id: 6, title: "Page Title", subtitle: "Aisha's Charity Week Page", editHref: "#" },
      ],
    },
  },
  "2": {
    id:                "2",
    fundraiserName:    "Omar",
    challengeTitle:    "Register - CW 10k Run",
    image:             "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=500&fit=crop",
    raised:            875000,
    goal:              1600000,
    totalDonors:       2180,
    recentDonorsCount: 890,
    daysLeft:          12,
    story: `Running for change  every step I take is dedicated to bringing clean water to communities in need. Join me on this journey and help us reach our goal together. Your donation, no matter the size, makes a real difference in people's lives.`,
    recentDonors: [
      {
        id:      1,
        name:    "Layla S.",
        message: "Sadaqah",
        timeAgo: "5m ago",
        amount:  1800,
        avatar:  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
      },
      {
        id:      2,
        name:    "Hassan A.",
        message: '"Keep going!"',
        timeAgo: "8m ago",
        amount:  1200,
        avatar:  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
      },
    ],
    dashboard: {
      raised:            1850,
      targetPct:         23,
      donationsCount:    8,
      leaderboardRank:   7,
      leaderboardGroup:  "Hyde Park",
      amountBehind:      320,
      totalDonors:       890,
      allDonationsCount: 8,
      giftAidAmount:     280,
      giftAidGifts:      5,
      pages: [
        { id: 1, title: "Page Title", subtitle: "Omar's Charity Week Page", editHref: "#" },
        { id: 2, title: "Page Title", subtitle: "Omar's Charity Week Page", editHref: "#" },
      ],
    },
  },
};

export function getFundraiser(id: string): Fundraiser | null {
  return FUNDRAISERS[id] ?? null;
}
