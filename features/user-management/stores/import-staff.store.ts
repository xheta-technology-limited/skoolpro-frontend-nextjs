import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerStoreReset } from "@/lib/store-registry";
import { ImportRecord } from "../types/api/template";
import { ColumnMapping } from "../types/import/staff";

type ImportStaffStore = {
  data: Partial<ImportRecord<ColumnMapping>>;
  clearData: () => void;
  updateData: (record: ImportRecord<ColumnMapping>) => void;
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
