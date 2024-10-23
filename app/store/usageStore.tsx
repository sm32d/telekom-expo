import { create } from "zustand";

export interface Bill {
  id: number;
  amount: number;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  billPeriod: string;
}

interface UsageData {
  bill: { amount: number; due: string };
  data: { used: number; total: number; unit: string };
  calls: { used: number; total: number; unit: string };
  sms: { used: number; total: number; unit: string };
  billHistory: Bill[];
}

export interface StoreState {
  usageData: UsageData;
  loading: boolean;
  error: null | string;
  updateUsage: <T extends keyof UsageData>(
    type: T,
    newData: UsageData[T],
  ) => void;
  fetchUsageData: () => Promise<void>;
}

const useUsageStore = create<StoreState>((set) => ({
  usageData: {
    bill: { amount: 45.78, due: "Nov 10" },
    data: { used: 15, total: 30, unit: "GB" },
    calls: { used: 934, total: 1000, unit: "Min" },
    sms: { used: 22, total: 100, unit: "SMS" },
    billHistory: [
      {
        id: 1,
        amount: 45.78,
        date: "2024-10-01",
        dueDate: "2024-10-10",
        status: "pending",
        billPeriod: "Oct 2024",
      },
      {
        id: 2,
        amount: 42.5,
        date: "2024-09-01",
        dueDate: "2024-09-10",
        status: "paid",
        billPeriod: "Sep 2024",
      },
      {
        id: 3,
        amount: 51.2,
        date: "2024-08-01",
        dueDate: "2024-08-10",
        status: "paid",
        billPeriod: "Aug 2024",
      },
      // Add more historical bills as needed
    ],
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
          billHistory: [
            {
              id: 1,
              amount: 45.78,
              date: "2024-10-01",
              dueDate: "2024-10-10",
              status: "pending",
              billPeriod: "Oct 2024",
            },
            {
              id: 2,
              amount: 42.5,
              date: "2024-09-01",
              dueDate: "2024-09-10",
              status: "paid",
              billPeriod: "Sep 2024",
            },
            {
              id: 3,
              amount: 51.2,
              date: "2024-08-01",
              dueDate: "2024-08-10",
              status: "paid",
              billPeriod: "Aug 2024",
            },
            // Add more historical bills as needed
          ],
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
