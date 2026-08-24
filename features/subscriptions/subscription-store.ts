import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BeginOnboardingResponse } from "@/features/onboarding/types/types";
import { registerStoreReset } from "@/lib/store-registry";

type SubscriptionStore = {
  created_school: BeginOnboardingResponse | null;
  setCreatedSchool: (data: BeginOnboardingResponse) => void;
  clearCreatedSchool: () => void;
};

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set) => ({
      created_school: null,
      setCreatedSchool: (data) => set({ created_school: data }),
      clearCreatedSchool: () => set({ created_school: null }),
    }),
    { name: "sp-subscription-store" }
  )
);

registerStoreReset(useSubscriptionStore.getState().clearCreatedSchool);
