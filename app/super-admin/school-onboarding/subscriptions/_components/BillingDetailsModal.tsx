"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";
import FormModal from "@/components/ui/form-modal";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";

import {
  useUpdateBillingDetails,
  type UpdateBillingDetailsPayload,
} from "@/features/subscriptions/api/update-billing-details";
import { emailString, phoneString } from "@/lib/utils/zod-schemas";

const billingDetailsSchema = z.object({
  billingContactName: z.string().min(1, "Billing contact name is required"),
  billingContactPhone: phoneString,
  billingContactEmail: emailString,
  billingAddress: z.string().optional(),
  purchaseOrderReference: z.string().optional(),
  taxIdentifier: z.string().optional(),
});

type BillingDetailsValues = z.infer<typeof billingDetailsSchema>;


interface BillingDetailsProfile {
  billingContactName?: string;
  billingContactPhone?: string;
  billingContactEmail?: string;
  billingAddress?: string;
  purchaseOrderReference?: string;
  taxIdentifier?: string;
}

interface BillingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId: string;
  currentDetails?: BillingDetailsProfile | null;
}


export default function BillingDetailsModal({
  open,
  onOpenChange,
  subscriptionId,
  currentDetails,
}: BillingDetailsModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<BillingDetailsValues>({
    resolver: zodResolver(billingDetailsSchema),
    defaultValues: {},
  });

  const { handleSubmit, reset, formState } = methods;

  useEffect(() => {
    if (open) {
      reset({
        billingContactName: currentDetails?.billingContactName ?? "",
        billingContactPhone: currentDetails?.billingContactPhone ?? "",
        billingContactEmail: currentDetails?.billingContactEmail ?? "",
        billingAddress: currentDetails?.billingAddress ?? "",
        purchaseOrderReference: currentDetails?.purchaseOrderReference ?? "",
        taxIdentifier: currentDetails?.taxIdentifier ?? "",
      });
    }
  }, [open, currentDetails, reset]);

  const updateBillingDetailsMutation = useUpdateBillingDetails();

  const onSubmit = async (values: BillingDetailsValues) => {

    const payload: UpdateBillingDetailsPayload = {
      billing_contact_name: values.billingContactName,
      billing_contact_email: values.billingContactEmail,
      billing_contact_phone: values.billingContactPhone || null,
      billing_address: values.billingAddress,
      purchase_order_reference: values.purchaseOrderReference,
      tax_identifier: values.taxIdentifier,
    };

    try {
      await updateBillingDetailsMutation.mutateAsync({
        subscriptionId,
        payload,
      });
      await queryClient.invalidateQueries({
        queryKey: ["subscription"],
      });
      toast.success("Billing details updated successfully.");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update billing details:", error);
      toast.error("Failed to update billing details. Please try again.");
    }
  };

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Billing Details"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <span className="text-[12px] font-normal uppercase leading-[1.2] text-neutrals-500">
            Billing Details
          </span>

          <Input
            name="billingContactName"
            label="Billing contact name"
          />
          <Input
            name="billingContactPhone"
            label="Billing contact phone"
          />
          <Input
            name="billingContactEmail"
            label="Billing contact email"
          />
          <Input name="billingAddress" label="Billing address" />
          <Input
            name="purchaseOrderReference"
            label="Purchase order reference"
          />
          <Input name="taxIdentifier" label="Tax identifier" />

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="flex h-14 flex-1 items-center justify-center rounded-[28px] border border-primary bg-base-white px-8 py-4"
            >
              <span className="text-[16px] font-normal leading-[1.2] text-primary">
                Cancel
              </span>
            </button>

            <Button
              type="submit"
              size="lg"
              loading={
                formState.isSubmitting ||
                updateBillingDetailsMutation.isPending
              }
              className="h-14 flex-1"
            >
              Save Details
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}