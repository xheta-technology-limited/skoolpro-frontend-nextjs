import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MFAMethod } from "./types/types";
import { keyof } from "zod";

type MfaData = {
  challenge_id?: string;
  available_methods?: MFAMethod[];
};

type authStore = {
  data: MfaData | null;
  updateData: <K extends keyof MfaData>(
    fieldName: K,
    value: MfaData[K]
  ) => void;
  clearData: () => void;
};

export const useAuth = create<authStore>()(
  persist(
    (set) => ({
      data: {},
      updateData: (fieldName, value) =>
        set((state) => ({ data: { ...state.data, [fieldName]: value } })),
      clearData: () => set(() => ({ data: {} })),
    }),
    { name: "sp-auth-store" }
  )
);

//RESET PASSWORD STORE
type ResetPasswordData = {
  login: string;
  code: string;
};
type ResetPasswordStoreType = {
  data: ResetPasswordData;
  updateField: <K extends keyof ResetPasswordData>(
    field: K,
    value: ResetPasswordData[K]
  ) => void;
  clearData: () => void;
};
export const useResetPasswordStore = create<ResetPasswordStoreType>()(
  persist(
    (set) => ({
      data: { login: "", code: "" },
      updateField: (fieldName, value) =>
        set((state) => ({ data: { ...state.data, [fieldName]: value } })),
      clearData: () => set(() => ({ data: { login: "", code: "" } })),
    }),
    { name: "sp-forgot-password-store" }
  )
);
