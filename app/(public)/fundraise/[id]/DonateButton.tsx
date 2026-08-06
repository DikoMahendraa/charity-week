"use client";

import { useRouter } from "next/navigation";

interface Props {
  fundraiserId:   string;
  fundraiserName: string;
}

export default function DonateButton({ fundraiserId, fundraiserName }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/fundraise/${fundraiserId}/donate`)}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#EC8900] py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-[#d47a00] active:scale-[0.99]"
    >
      {`Donate to ${fundraiserName}`}
    </button>
  );
}
