import { create } from "zustand";

interface UsageData {
  bill: { amount: number; due: string };
  data: { used: number; total: number; unit: string };
  calls: { used: number; total: number; unit: string };
  sms: { used: number; total: number; unit: string };
}

export interface StoreState {
  usageData: UsageData;
  loading: boolean;
  error: null | string;
  updateUsage: <T extends keyof UsageData>(
    type: T,
    newData: UsageData[T]
  ) => void;
  fetchUsageData: () => Promise<void>;
}

// Create store with the new syntax
const useUsageStore = create<StoreState>((set) => ({
  usageData: {
    bill: { amount: 45.78, due: "Nov 10" },
    data: { used: 15, total: 30, unit: "GB" },
    calls: { used: 934, total: 1000, unit: "Min" },
    sms: { used: 22, total: 100, unit: "SMS" },
  },
  loading: false,
  error: null,
  updateUsage: <T extends keyof UsageData>(type: T, newData: UsageData[T]) =>
    set((state) => ({
      usageData: { ...state.usageData, [type]: newData },
    })),
  fetchUsageData: async () => {
    set({ loading: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({
        usageData: {
          bill: { amount: 45.78, due: "Nov 10" },
          data: { used: 15, total: 30, unit: "GB" },
          calls: { used: 934, total: 1000, unit: "Min" },
          sms: { used: 22, total: 100, unit: "SMS" },
        },
        loading: false,
        error: null,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));

export default useUsageStore;
