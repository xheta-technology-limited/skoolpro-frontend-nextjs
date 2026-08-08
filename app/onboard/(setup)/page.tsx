"use client";

import { ThirdForm, SecondForm, FirstForm, FourthForm } from "./_components";
import { useOnboardForm } from "@/features/onboard/onboarding-store";

export default function FormSwitcher() {
  const step = useOnboardForm((state) => state.data);

  return (
    <>
      {step === 0 && <FirstForm />}
      {step === 1 && <SecondForm />}
      {step === 2 && <ThirdForm />}
      {step === 3 && <FourthForm />}
    </>
  );
}
