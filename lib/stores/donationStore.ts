import { create } from "zustand";

export interface DonationState {
  fundraiserId:   string;
  fundraiserName: string;
  selectedAmount: number | null; // preset amount, null if using custom
  customAmount:   string;        // raw string from custom input
  includeTip:     boolean;

  // Derived
  baseAmount:  () => number;
  tipAmount:   () => number;
  totalAmount: () => number;

  // Actions
  setFundraiser:    (id: string, name: string) => void;
  setSelectedAmount:(amount: number | null) => void;
  setCustomAmount:  (raw: string) => void;
  setIncludeTip:    (include: boolean) => void;
  reset:            () => void;
}

const DEFAULT: Pick<DonationState, "fundraiserId" | "fundraiserName" | "selectedAmount" | "customAmount" | "includeTip"> = {
  fundraiserId:   "",
  fundraiserName: "",
  selectedAmount: 25,
  customAmount:   "",
  includeTip:     true,
};

export const useDonationStore = create<DonationState>((set, get) => ({
  ...DEFAULT,

  baseAmount() {
    const { selectedAmount, customAmount } = get();
    if (selectedAmount !== null) return selectedAmount;
    const parsed = parseFloat(customAmount);
    return isNaN(parsed) ? 0 : parsed;
  },

  tipAmount() {
    return get().includeTip ? Math.round(get().baseAmount() * 0.1 * 100) / 100 : 0;
  },

  totalAmount() {
    return Math.round((get().baseAmount() + get().tipAmount()) * 100) / 100;
  },

  setFundraiser:    (id, name) => set({ fundraiserId: id, fundraiserName: name }),
  setSelectedAmount:(amount)   => set({ selectedAmount: amount, customAmount: "" }),
  setCustomAmount:  (raw)      => set({ customAmount: raw, selectedAmount: null }),
  setIncludeTip:    (include)  => set({ includeTip: include }),
  reset:            ()         => set(DEFAULT),
}));
