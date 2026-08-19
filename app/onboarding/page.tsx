"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { AdmiralBlue11 } from "@/components/icons/logos";
import BillingToggle from "./_components/BillingToggle";
import PricingCard, { PricingPlan } from "./_components/PricingCard";
import Stepper from "./_components/Stepper";
import DetailCard from "./_components/DetailCard";
import SchoolProfileStep, {
  SchoolProfileFormValues,
  SCHOOL_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
} from "./_components/SchoolProfileStep";
import { useGetPlans } from "@/features/subscriptions/api/get-plans";
import { useOnboardSchool } from "@/features/onboarding/api/api";
import { Button } from "@/components/ui/custom-button";
import { Spinner } from "@/components/animations";

function getOptionLabel(
  options: { label: string; value: string }[],
  value: string | undefined
): string {
  return options.find((o) => o.value === value)?.label ?? value ?? "";
}

const plans: PricingPlan[] = [
  {
    name: "Small School",
    description: "Core academic modules for small schools",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stats: [
      { label: "Students", value: "300" },
      { label: "Staff", value: "40" },
      { label: "Campuses", value: "1" },
      { label: "Storage", value: "5 GB" },
    ],
    moduleCount: 5,
    features: ["Admissions", "Attendance", "Exam", "Finance", "Communication"],
  },
  {
    name: "Medium School",
    description: "Core plus common operational modules for medium schools",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stats: [
      { label: "Students", value: "300" },
      { label: "Staff", value: "40" },
      { label: "Campuses", value: "1" },
      { label: "Storage", value: "5 GB" },
    ],
    moduleCount: 8,
    features: ["Core", "Behaviour", "Library", "Transport"],
  },
  {
    name: "Large School",
    description: "Full operational suite for large or multi-campus schools",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stats: [
      { label: "Students", value: "5000" },
      { label: "Staff", value: "600" },
      { label: "Campuses", value: "10" },
      { label: "Storage", value: "100 GB" },
    ],
    moduleCount: 12,
    features: ["All core", "Inventory", "Hostel", "Health", "HR & payroll"],
  },
  {
    name: "Enterprise",
    description: "All modules, unlimited scale, negotiated terms",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stats: [
      { label: "Students", value: "Unlimited" },
      { label: "Staff", value: "Unlimited" },
      { label: "Campuses", value: "Unlimited" },
      { label: "Storage", value: "Unlimited" },
    ],
    moduleCount: 12,
    features: ["Everything in Large"],
  },
];

export default function SubscriptionsPage() {
  const [step, setStep] = useState<
    "school-profile" | "choose-plan" | "review" | "success"
  >("school-profile");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [schoolProfileData, setSchoolProfileData] =
    useState<SchoolProfileFormValues | null>(null);

  useEffect(() => {
    if (step === "success") {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [step]);

  function handleContinueFromPlan() {
    if (!selectedPlan) return;
    setStep("review");
  }
  const { isPending: submitPending, mutate: submitMutate } = useOnboardSchool();

  function handleContinueFromReview() {
    if (!schoolProfileData) {
      console.log("SchoolProfileData is null");
      return;
    }
    submitMutate(schoolProfileData, {
      onSuccess: () => setStep("success"),
    });
  }

  const { isPending: isPlansPending, data: plansData } = useGetPlans();
  useEffect(() => {
    console.log("plans data is: ", plansData);
  }, [plansData]);
  const selectedPlanData = plans.find((plan) => plan.name === selectedPlan);

  const primaryCampus =
    schoolProfileData?.campuses?.find((c) => c.is_primary) ??
    schoolProfileData?.campuses?.[0];
  const primaryContact =
    schoolProfileData?.contacts?.find((c) => c.is_primary) ??
    schoolProfileData?.contacts?.[0];
  const emailContact = schoolProfileData?.contacts?.find(
    (c) => c.type === "email"
  );
  const phoneContact = schoolProfileData?.contacts?.find(
    (c) => c.type === "phone"
  );
  const firstRegistration = schoolProfileData?.registration_numbers?.[0];

  return (
    <div className="min-h-screen bg-[#f5f5ff]">
      <div className="mx-4 py-16 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-25">
        <div className="flex justify-center">
          <AdmiralBlue11 width={200} height={51} />
        </div>

        <div className="mt-8 flex justify-center">
          <Stepper currentStep={step === "success" ? "review" : step} />
        </div>

        <div className="mt-12 rounded-2xl bg-white p-6">
          {step === "school-profile" && (
            <Suspense fallback={<div>Loading...</div>}>
              <SchoolProfileStep
                defaultValues={schoolProfileData ?? undefined}
                onContinue={(data) => {
                  setSchoolProfileData(data);
                  setStep("choose-plan");
                }}
              />
            </Suspense>
          )}

          {step === "choose-plan" && (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutrals-900">
                    Choose a subscription plan
                  </h2>
                  <p className="text-sm text-neutrals-500">
                    Modules and limits are copied onto this school when you
                    continue.
                  </p>
                </div>

                <div className="hidden lg:block">
                  <BillingToggle
                    billingCycle={billingCycle}
                    onChange={setBillingCycle}
                  />
                </div>
              </div>

              <div className="sticky top-0 z-20 mt-4 bg-white/95 px-4 py-4 backdrop-blur-sm lg:hidden">
                <div className="flex justify-center">
                  <BillingToggle
                    billingCycle={billingCycle}
                    onChange={setBillingCycle}
                  />
                </div>
              </div>

              {isPlansPending ? (
                <div className="flex items-center content-center h-full">
                  <Spinner size={100} />
                </div>
              ) : (
                <div className="mt-8.75 grid grid-cols-1 gap-8 lg:grid-cols-4">
                  {plansData?.map((plan) => (
                    <PricingCard
                      key={plan.key}
                      plan={plan}
                      billingCycle={billingCycle}
                      isSelected={selectedPlan === plan.name}
                      onSelectPlan={setSelectedPlan}
                    />
                  ))}
                </div>
              )}

              <div className="mt-8 flex gap-6">
                <button
                  onClick={() => setStep("school-profile")}
                  className="flex h-13.5 flex-1 items-center justify-center gap-2.5 rounded-[28px] border border-primary px-8 py-4"
                >
                  <span className="text-[16px] font-normal leading-[1.2] text-primary">
                    Back
                  </span>
                </button>
                <button
                  onClick={handleContinueFromPlan}
                  disabled={!selectedPlan}
                  className="group flex h-13.5 flex-1 items-center justify-center gap-2.5 rounded-[28px] border border-primary bg-primary px-8 py-4 transition-colors disabled:cursor-not-allowed disabled:border-neutrals-300 disabled:bg-neutrals-300"
                >
                  <span className="text-[16px] font-normal leading-[1.2] text-white transition-colors">
                    Continue
                  </span>
                </button>
              </div>
            </>
          )}

          {step === "review" && (
            <>
              <h2 className="text-lg font-semibold text-neutrals-900">
                Review and Confirm
              </h2>
              <p className="text-sm text-neutrals-500">
                Confirm the subscription before it&apos;s created for{" "}
                {schoolProfileData?.school?.registered_name || "this school"}.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <DetailCard
                  title="School details"
                  onEdit={() => setStep("school-profile")}
                  fields={[
                    {
                      label: "School name",
                      value: schoolProfileData?.school?.registered_name ?? "",
                    },
                    {
                      label: "School type",
                      value:
                        schoolProfileData?.type_slugs
                          ?.map((t) => getOptionLabel(SCHOOL_TYPE_OPTIONS, t))
                          .join(", ") ?? "",
                    },
                    {
                      label: "Ownership type",
                      value: getOptionLabel(
                        OWNERSHIP_TYPE_OPTIONS,
                        schoolProfileData?.school?.ownership_type
                      ),
                    },
                    {
                      label: "Primary contact",
                      value: primaryContact?.label ?? "",
                    },
                    {
                      label: "Registration number",
                      value: firstRegistration?.number ?? "",
                    },
                    {
                      label: "School address",
                      value: primaryCampus?.address_line_1 ?? "",
                    },
                    {
                      label: "Email",
                      value: emailContact?.value ?? "Not provided",
                    },
                    {
                      label: "Phone number",
                      value: phoneContact?.value ?? "Not provided",
                    },
                  ]}
                />

                <DetailCard
                  title="Subscription"
                  onEdit={() => setStep("choose-plan")}
                  fields={[
                    { label: "Plan", value: selectedPlan ?? "" },
                    {
                      label: "Billing",
                      value: billingCycle === "monthly" ? "Monthly" : "Yearly",
                    },
                    { label: "Status", value: "Pending payment" },
                    {
                      label: "Students",
                      value: selectedPlanData?.stats[0]?.value ?? "",
                    },
                    {
                      label: "Staff",
                      value: selectedPlanData?.stats[1]?.value ?? "",
                    },
                    {
                      label: "Campuses",
                      value: selectedPlanData?.stats[2]?.value ?? "",
                    },
                    {
                      label: "Storage",
                      value: selectedPlanData?.stats[3]?.value ?? "",
                    },
                    {
                      label: "Modules",
                      value: String(selectedPlanData?.moduleCount ?? ""),
                    },
                  ]}
                />
              </div>

              <div className="mt-8 flex gap-6">
                <button
                  onClick={() => setStep("choose-plan")}
                  className="flex h-13.5 flex-1 items-center justify-center gap-2.5 rounded-[28px] border border-primary px-8 py-4"
                >
                  <span className="text-[16px] font-normal leading-[1.2] text-primary">
                    Back
                  </span>
                </button>
                <Button
                  className="flex-1"
                  onClick={handleContinueFromReview}
                  loading={submitPending}
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === "success" && (
            <div className="flex min-h-119.75 flex-col items-center justify-center px-6 py-12">
              <div className="flex w-full max-w-161.25 flex-col items-center gap-8">
                <div className="flex w-full flex-col items-center gap-4">
                  <div className="flex h-25 w-25 items-center justify-center">
                    <Image src="/success.png" alt="" width={100} height={100} />
                  </div>

                  <h2 className="text-center w-full max-w-full wrap-break-word text-[24px] font-semibold leading-[1.2] text-neutrals-900">
                    Onboarding started for{" "}
                    {schoolProfileData?.school?.registered_name ||
                      "this school"}
                  </h2>

                  <p className="text-center text-[18px] font-normal leading-[1.2] text-neutrals-900">
                    The school and its subscription are set up. The{" "}
                    {selectedPlan} plan&apos;s modules are now active, and the
                    onboarding is ready to move through its stages.
                  </p>
                </div>

                <div className="flex h-9.5 w-66 items-center justify-center gap-2.5 rounded-[28px] border border-primary bg-[#F5F5FF] px-4 py-2">
                  <span className="whitespace-nowrap text-center text-[18px] font-normal leading-[1.2] text-primary">
                    Reference K-NR-924-0124
                  </span>
                </div>

                <button className="flex h-13.5 w-66.75 items-center justify-center gap-2.5 rounded-[28px] bg-primary px-8 py-4">
                  <span className="text-center text-[18px] font-normal leading-[1.2] text-base-white">
                    Proceed to Dashboard
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
