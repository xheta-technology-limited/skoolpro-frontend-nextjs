import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerStoreReset } from "@/lib/store-registry";
import { ImportRecord } from "../types/api/template";

type ImportStaffStore = {
  data: Partial<ImportRecord>;
  clearData: () => void;
  updateData: (record: ImportRecord) => void;
};

export const useImportStaffStore = create<ImportStaffStore>()(
  persist(
    (set) => ({
      data: {},
      clearData: () => set(() => ({ data: {} })),
      updateData: (value) => set(() => ({ data: value })),
    }),
    { name: "sp-import-staff-store" }
  )
);

registerStoreReset(useImportStaffStore.getState().clearData);
