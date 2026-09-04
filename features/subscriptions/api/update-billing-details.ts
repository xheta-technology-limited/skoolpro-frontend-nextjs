import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import type { Subscription } from "../types/types";
import { ServerErrorResponse } from "@/types/api";

export interface UpdateBillingDetailsPayload {
  billing_contact_name?: string;
  billing_contact_email?: string;
  billing_contact_phone?: string | null;
  billing_address?: string;
  purchase_order_reference?: string;
  tax_identifier?: string;
}

export interface UpdateBillingDetailsParams {
  subscriptionId: string;
  payload: UpdateBillingDetailsPayload;
}

export const updateBillingDetails = (
  params: UpdateBillingDetailsParams
): Promise<Subscription> => {
  return api.put(
    `subscriptions/${params.subscriptionId}/billing-details`,
    params.payload
  );
};

export const useUpdateBillingDetails = () => {
  return useMutation<
    Subscription,
    ServerErrorResponse,
    UpdateBillingDetailsParams
  >({
    mutationFn: updateBillingDetails,
  });
};