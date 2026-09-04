import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { Subscription, ApplyPlanParams } from "../types/types";
import { ServerErrorResponse } from "@/types/api";

export const applyPlan = (
  params: ApplyPlanParams
): Promise<Subscription> => {
  return api.post(
    `subscriptions/${params.subscriptionId}/apply-plan`,
    params.payload
  );
};

export const useApplyPlan = () => {
  return useMutation<Subscription, ServerErrorResponse, ApplyPlanParams>({
    mutationFn: applyPlan,
  });
};