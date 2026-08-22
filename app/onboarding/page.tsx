"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { AdmiralBlue11 } from "@/components/icons/logos";
import PricingCard, { PricingPlan } from "./_components/PricingCard";
import Stepper from "./_components/Stepper";
import DetailCard from "./_components/DetailCard";
import BillingDetailsModal from "./_components/BillingDetailsModal";
import type { BillingDetailsFormValues } from "@/features/onboarding/schemas/billing-details-schema";
import SchoolProfileStep, {
  SchoolProfileFormValues,
  SCHOOL_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
} from "./_components/SchoolProfileStep";
import { useGetPlans } from "@/features/subscriptions/api/get-plans";
import { Spinner } from "@/components/animations";
import { useSubscriptionStore } from "@/features/subscriptions/subscription-store";

export default function SubscriptionsPage() {
  const [step, setStep] = useState<
    "school-profile" | "choose-plan" | "success"
  >("school-profile");
  const createdSchoolReference = useSubscriptionStore(
    (s) => s.created_school?.reference_number
  );
  const clearStore = useSubscriptionStore((s) => s.clearCreatedSchool);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [schoolProfileData, setSchoolProfileData] =
    useState<SchoolProfileFormValues | null>(null);

  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [billingDetails, setBillingDetails] =
    useState<BillingDetailsFormValues | null>(null);

  useEffect(() => {
    if (step === "success") {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  }, [step]);

  const {
    isPending: isPlansPending,
    isError: isPlansError,
    data: plansData,
    refetch: refetchPlans,
  } = useGetPlans();

  const selectedPlanFromApi = plansData?.find(
    (plan) => plan.key === selectedPlan
  );

  function handleSelectPlan(planKey: string) {
    setSelectedPlan(planKey);
    setBillingModalOpen(true);
  }

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
                onSuccess={(data) => {
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
              </div>

              {isPlansPending ? (
                <div className="flex h-[30vh] w-full items-center justify-center md:h-[50vh]">
                  <Spinner size={50} />
                </div>
              ) : isPlansError ? (
                <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 md:min-h-[50vh]">
                  <p className="text-sm text-neutrals-500">
                    Unable to load subscription plans.
                  </p>
                  <button
                    type="button"
                    onClick={() => refetchPlans()}
                    className="flex h-13.5 items-center justify-center rounded-[28px] bg-primary px-8 py-4"
                  >
                    <span className="text-[16px] font-normal leading-[1.2] text-white">
                      Retry
                    </span>
                  </button>
                </div>
              ) : (
                <div className="mt-8.75 grid grid-cols-1 gap-8 lg:grid-cols-4">
                  {plansData?.map((plan) => (
                    <PricingCard
                      key={plan.key}
                      plan={plan}
                      isSelected={selectedPlan === plan.key}
                      onSelectPlan={handleSelectPlan}
                    />
                  ))}
                </div>
              )}

              <BillingDetailsModal
                open={billingModalOpen}
                onOpenChange={setBillingModalOpen}
                selectedPlan={selectedPlanFromApi!}
                defaultValues={billingDetails ?? undefined}
                setStep={() => setStep("success")}
                onSave={(data) => setBillingDetails(data)}
              />

              <div className="mt-8 flex gap-6 justify-center">
                <button
                  onClick={() => setStep("school-profile")}
                  className="flex h-13.5 flex-1 max-w-80 items-center justify-center gap-2.5 rounded-[28px] border border-primary px-8 py-4"
                >
                  <span className="text-[16px] font-normal leading-[1.2] text-primary">
                    Back
                  </span>
                </button>
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

                  <h2 className="wrap-break-word w-full max-w-full text-center text-[24px] font-semibold leading-[1.2] text-neutrals-900">
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
                    Reference {createdSchoolReference}
                  </span>
                </div>

                <button
                  className="flex h-13.5 w-66.75 items-center justify-center rounded-[28px] bg-primary px-8 py-4"
                  onClick={() => {
                    //TODO: clear Store and navigate to the dashboard
                    clearStore();
                  }}
                >
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