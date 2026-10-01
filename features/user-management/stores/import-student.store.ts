import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerStoreReset } from "@/lib/store-registry";
import { ImportRecord } from "../types/api/template";
import { AnyColumnMapping } from "../types/import";

type ImportStudentsStore = {
  data: Partial<ImportRecord<AnyColumnMapping>>;
  clearData: () => void;
  updateData: (record: ImportRecord<AnyColumnMapping>) => void;
};

export const useImportStudentsStore = create<ImportStudentsStore>()(
  persist(
    (set) => ({
      data: {},
      clearData: () => set(() => ({ data: {} })),
      updateData: (value) => set(() => ({ data: value })),
    }),
    { name: "sp-import-students-store" }
  )
);

registerStoreReset(useImportStudentsStore.getState().clearData);