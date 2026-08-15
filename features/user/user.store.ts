import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserStore as UserStoreType } from "./types/user";

type UserStore = {
  data: Partial<UserStoreType>;
  updateField: <K extends keyof UserStoreType>(
    fieldName: K,
    value: UserStoreType[K]
  ) => void;
  clearData: () => void;
  updateData: (user: UserStoreType) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      data: {},
      updateField: (fieldName, value) =>
        set((state) => ({ data: { ...state.data, [fieldName]: value } })),
      clearData: () => set(() => ({ data: {} })),
      updateData: (value) => set(() => ({ data: value })),
    }),
    { name: "sp-user-store" }
  )
);
