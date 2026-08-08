import { create } from "zustand";

type FormSteps = {
  data: number;
  updateStep: (step: number) => void;
};

export const useOnboardForm = create<FormSteps>((set) => ({
  data: 0,
  updateStep: (step) => set(() => ({ data: step })),
}));
