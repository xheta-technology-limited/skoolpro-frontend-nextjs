"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import FormModal from "@/components/ui/form-modal";
import { Button } from "@/components/ui/custom-button";
import { Spinner } from "@/components/animations";
import PricingCard from "@/app/onboarding/_components/PricingCard";

import { useGetPlans } from "@/features/subscriptions/api/get-plans";
import { useApplyPlan } from "@/features/subscriptions/api/apply-plan";

interface UpgradePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  subscriptionId: string;
}


export default function UpgradePlanModal({
  open,
  onOpenChange,
  schoolId,
  subscriptionId,
}: UpgradePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: plansData,
    isPending: isPlansPending,
    isError: isPlansError,
    refetch: refetchPlans,
  } = useGetPlans();

  const applyPlanMutation = useApplyPlan();

  function handleSelectPlan(planKey: string) {
    setSelectedPlan(planKey);
  }

  async function handleChoosePlan() {
    if (!selectedPlan || !subscriptionId) {
      return;
    }

    try {
      await applyPlanMutation.mutateAsync({
        subscriptionId,
        payload: {
          plan_key: selectedPlan,
          replace_modules: true,
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ["subscription", schoolId],
      });
      toast.success("Subscription plan updated successfully.");
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to apply plan:", error);
      toast.error("Failed to update subscription plan. Please try again.");
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSelectedPlan(null);
    }
    onOpenChange(nextOpen);
  }

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title={
        <div className="flex flex-col gap-1">
          <span
            className="font-poppins text-[18px] font-bold leading-[1.2] tracking-normal text-neutrals-900"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Choose a subscription plan
          </span>
          <span className="text-sm font-normal text-neutrals-500">
            Modules and limits are copied onto this school when you continue.
          </span>
        </div>
      }
      maxWidth="max-w-[1344px]"
    >
      <div className="flex flex-col gap-1">
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {plansData?.map((plan) => (
              <PricingCard
                key={plan.key}
                plan={plan}
                isSelected={selectedPlan === plan.key}
                onSelectPlan={handleSelectPlan}
                heightClassName="lg:h-136.5"
                maxVisibleModules={5}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col justify-center gap-6 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => handleOpenChange(false)}
            className="h-13.5 w-full max-w-159 sm:flex-1"
          >
            Back
          </Button>

          <Button
            type="button"
            size="lg"
            onClick={handleChoosePlan}
            disabled={!selectedPlan}
            loading={applyPlanMutation.isPending}
            className="h-13.5 w-full max-w-159 sm:flex-1"
          >
            Send Request
          </Button>
        </div>
      </div>
    </FormModal>
  );
}