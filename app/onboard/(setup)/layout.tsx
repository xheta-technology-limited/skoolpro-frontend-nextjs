"use client";
import { AdmiralBlue11 } from "@/components/icons/logos";
import Link from "next/link";
import Image from "next/image";
import StepProgress from "./_components/step-progress";
import { useState } from "react";
import { useOnboardForm } from "@/features/onboard/onboarding-store";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentStep = useOnboardForm((state) => state.data);
  const updateStep = useOnboardForm((state) => state.updateStep);
  const steps = [
    { label: "School details" },
    { label: "School details" },
    { label: "School details" },
    { label: "Upload school's documents" },
  ];
  return (
    <div className="py-12 px-6 h-full sm:px-14 md:px-29.25 flex flex-col items-center w-full">
      <Link href={"/"} className="mb-8">
        <AdmiralBlue11 height={51} width={199} />
      </Link>

      <StepProgress
        steps={steps}
        currentStep={currentStep}
        onStepChange={updateStep}
      />
      <div className="h-14.25" />
      <div className="flex h-full flex-wrap xl:flex-nowrap gap-16.5 items-center justify-center w-full">
        <Image
          src={"/images/onboard/onboard_card.png"}
          height={660}
          width={640}
          alt="welcome"
          className="hidden w-64 h-auto md:w-160 sm:block"
        />

        {children}
      </div>
    </div>
  );
}
