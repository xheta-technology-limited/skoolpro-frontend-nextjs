import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerStoreReset } from "@/lib/store-registry";
import { ImportRecord } from "../types/api/template";
import { AnyColumnMapping } from "../types/import";

type ImportGuardianStore = {
  data: Partial<ImportRecord<AnyColumnMapping>>;
  clearData: () => void;
  updateData: (record: ImportRecord<AnyColumnMapping>) => void;
};

export const useImportGuardianStore = create<ImportGuardianStore>()(
  persist(
    (set) => ({
      data: {},
      clearData: () => set(() => ({ data: {} })),
      updateData: (value) => set(() => ({ data: value })),
    }),
    { name: "sp-import-guardian-store" }
  )
);

registerStoreReset(useImportGuardianStore.getState().clearData);
