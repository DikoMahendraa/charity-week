"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDonationStore } from "@/lib/stores/donationStore";

/* ── Zod schema ─────────────────────────────────────────────── */
const schema = z
  .object({
    amountType: z.enum(["preset", "custom"]),
    presetAmount: z.number().optional(),
    customAmount: z.string().optional(),
    includeTip: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.amountType === "custom") {
      const n = parseFloat(data.customAmount ?? "");
      if (isNaN(n) || n <= 0) {
        ctx.addIssue({ code: "custom", path: ["customAmount"], message: "Enter a valid amount greater than £0" });
      }
    } else if (!data.presetAmount) {
      ctx.addIssue({ code: "custom", path: ["presetAmount"], message: "Select an amount" });
    }
  });

type FormValues = z.infer<typeof schema>;

/* ── Static data ────────────────────────────────────────────── */
const PRESETS = [
  { amount: 10, label: "Iftar for 2", description: "Price point description" },
  { amount: 25, label: "food parcel", description: "Price point description" },
  { amount: 50, label: "water for a family", description: "Price point description" },
  { amount: 100, label: "orphan support", description: "Price point description" },
  { amount: 250, label: "major gift", description: "Price point description" },
  { amount: 500, label: "emergency relief", description: "Price point description" },
];

/* ── Fundraiser info card ────────────────────────────────────── */
interface InfoCardProps {
  image: string;
  challengeTitle: string;
  raised: number;
  goal: number;
  totalDonors: number;
  daysLeft: number;
}

function formatFull(n: number) { return "£" + n.toLocaleString("en-GB"); }
function formatShort(n: number) {
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `£${(n / 1_000).toFixed(0)}K`;
  return `£${n}`;
}

function InfoCard({ image, challengeTitle, raised, goal, totalDonors, daysLeft }: InfoCardProps) {
  const pct = Math.min(100, Math.round((raised / goal) * 100));
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Cover photo */}
      {image ? (
        <img src={image} alt={challengeTitle} className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 w-full flex-col items-center justify-center bg-gray-100 text-gray-300">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <span className="mt-1 text-xs">Cover photo</span>
        </div>
      )}

      <div className="p-4">
        <p className="text-sm font-bold text-gray-700">{challengeTitle}</p>
        <p className="text-xs text-gray-400">Description</p>
        <p className="mt-2 text-3xl font-extrabold leading-none text-gray-900">{formatFull(raised)}</p>
        <p className="mb-3 mt-0.5 text-xs text-gray-400">raised of {formatFull(goal)} goal.</p>

        <div className="mb-1 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-[#EC8900]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mb-4 flex justify-between text-xs">
          <span className="font-semibold text-[#EC8900]">{pct}% completed</span>
          <span className="text-gray-400">Goal: {formatShort(goal)}</span>
        </div>

        <div className="grid grid-cols-2 border-t border-gray-100 pt-3">
          <div>
            <p className="text-sm font-bold text-gray-900">{totalDonors.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Generous Donors</p>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{daysLeft} Days</p>
            <p className="text-xs text-gray-400">Time Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main form ───────────────────────────────────────────────── */
interface Props {
  fundraiserId: string;
  fundraiserName: string;
  image: string;
  challengeTitle: string;
  raised: number;
  goal: number;
  totalDonors: number;
  daysLeft: number;
}

export default function DonationForm(props: Props) {
  const { fundraiserId, fundraiserName, image, challengeTitle, raised, goal, totalDonors, daysLeft } = props;
  const router = useRouter();

  const store = useDonationStore();

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amountType: "preset",
      presetAmount: store.selectedAmount ?? 25,
      customAmount: store.customAmount,
      includeTip: store.includeTip,
    },
  });

  // Hydrate store on mount
  useEffect(() => {
    store.setFundraiser(fundraiserId, fundraiserName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundraiserId, fundraiserName]);

  const amountType = watch("amountType");
  const presetAmount = watch("presetAmount");
  const customAmount = watch("customAmount") ?? "";
  const includeTip = watch("includeTip");

  // Keep store in sync with form
  useEffect(() => {
    if (amountType === "preset") {
      store.setSelectedAmount(presetAmount ?? null);
    } else {
      store.setCustomAmount(customAmount);
    }
  }, [amountType, presetAmount, customAmount]);

  useEffect(() => {
    store.setIncludeTip(includeTip);
  }, [includeTip]);

  const base = amountType === "preset" ? (presetAmount ?? 0) : (parseFloat(customAmount) || 0);
  const tip = includeTip ? Math.round(base * 0.1 * 100) / 100 : 0;
  const total = Math.round((base + tip) * 100) / 100;

  function onSubmit() {
    router.push(`/fundraise/${fundraiserId}/donate/payment`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4 pb-36 pt-4">
      {/* Fundraiser info card */}
      <InfoCard
        image={image}
        challengeTitle={challengeTitle}
        raised={raised}
        goal={goal}
        totalDonors={totalDonors}
        daysLeft={daysLeft}
      />

      {/* Choose an amount */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        {/* Section label */}
        <div className="mb-3 flex items-center gap-1.5">
          <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wide text-red-500">TEXT</span>
        </div>
        <h2 className="mb-4 text-lg font-extrabold text-gray-900">Choose an amount</h2>

        {/* Preset options */}
        <Controller
          control={control}
          name="presetAmount"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {PRESETS.map(preset => {
                const isSelected = amountType === "preset" && field.value === preset.amount;
                return (
                  <label
                    key={preset.amount}
                    className={`flex cursor-pointer items-start justify-between rounded-xl border-2 p-3.5 transition-all ${isSelected
                        ? "border-[#EC8900] bg-orange-50"
                        : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                  >
                    <div>
                      <p className="text-base font-extrabold text-gray-900">£{preset.amount}</p>
                      <p className="text-sm font-semibold text-gray-600">{preset.label}</p>
                      <p className="text-xs text-gray-400">{preset.description}</p>
                      <p className="text-xs text-gray-300">x claimed</p>
                    </div>
                    <input
                      type="radio"
                      className="mt-1 h-4 w-4 accent-[#EC8900]"
                      checked={isSelected}
                      onChange={() => {
                        field.onChange(preset.amount);
                        setValue("amountType", "preset");
                        setValue("customAmount", "");
                      }}
                    />
                  </label>
                );
              })}
            </div>
          )}
        />

        {/* Custom amount */}
        <p className="mb-2 mt-4 text-xs font-semibold text-gray-500">Or enter a custom amount</p>
        <Controller
          control={control}
          name="customAmount"
          render={({ field }) => (
            <div
              className={`flex items-center gap-2 rounded-xl border-2 px-3.5 py-3 transition-all ${amountType === "custom" ? "border-[#EC8900] bg-orange-50" : "border-gray-100 bg-white"
                }`}
            >
              <span className="text-base font-bold text-gray-400">£</span>
              <input
                {...field}
                type="number"
                inputMode="decimal"
                placeholder="custom"
                min="1"
                step="0.01"
                onFocus={() => setValue("amountType", "custom")}
                onChange={e => {
                  field.onChange(e);
                  setValue("amountType", "custom");
                }}
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none"
              />
              <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          )}
        />
        {(errors.customAmount || errors.presetAmount) && (
          <p className="mt-1 text-xs text-red-500">{errors.customAmount?.message ?? errors.presetAmount?.message}</p>
        )}
      </div>

      {/* Optional tip */}
      <Controller
        control={control}
        name="includeTip"
        render={({ field }) => (
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
            <input
              type="checkbox"
              checked={field.value}
              onChange={e => field.onChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-green-600"
            />
            <div>
              <p className="text-sm font-bold text-gray-800">Optional Tip To The Platform</p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                10% - covers running costs. IRUK keeps 100% of your donation.
              </p>
            </div>
          </label>
        )}
      />

      {/* Security note */}
      <div className="flex items-start gap-2.5 rounded-2xl border border-gray-100 bg-white p-4">
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <p className="text-xs leading-relaxed text-gray-400">
          Every donation is 100% secure and directly funds our on-the-ground charity operations.
        </p>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 bg-white px-4 pb-6 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button
          type="submit"
          disabled={total <= 0}
          className="w-full rounded-2xl bg-[#EC8900] py-4 text-sm font-bold text-white transition-colors hover:bg-[#d47a00] active:scale-[0.99] disabled:opacity-50"
        >
          into Donate £{total.toFixed(2)}
        </button>
      </div>
    </form>
  );
}
