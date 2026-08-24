import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SchoolProfile as SchoolProfileType } from "./types/school-profile";

type SchoolProfileStore = {
  data: Partial<SchoolProfileType>;
  updateField: <K extends keyof SchoolProfileType>(
    fieldName: K,
    value: SchoolProfileType[K]
  ) => void;
  clearData: () => void;
  updateData: (user: SchoolProfileType) => void;
};

export const useUserStore = create<SchoolProfileStore>()(
  persist(
    (set) => ({
      data: {},
      updateField: (fieldName, value) =>
        set((state) => ({ data: { ...state.data, [fieldName]: value } })),
      clearData: () => set(() => ({ data: {} })),
      updateData: (value) => set(() => ({ data: value })),
    }),
    { name: "sp-school-profile-store" }
  )
);
