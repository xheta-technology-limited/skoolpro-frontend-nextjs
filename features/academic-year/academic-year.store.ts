import { create } from "zustand";
import { registerStoreReset } from "@/lib/store-registry";
import { AcademicYear } from "./types/api/academic-year";

type AcademicYearStore = {
  lastAcademicYear: AcademicYear | null;
  setLastAcademicYear: (year: AcademicYear) => void;
  clearData: () => void;
};

export const useAcademicYearStore = create<AcademicYearStore>()((set) => ({
  lastAcademicYear: null,
  setLastAcademicYear: (year) => set(() => ({ lastAcademicYear: year })),
  clearData: () => set(() => ({ lastAcademicYear: null })),
}));

registerStoreReset(useAcademicYearStore.getState().clearData);
