"use client";

import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {
  billingDetailsSchema,
  type BillingDetailsFormValues,
} from "@/features/auth/schemas";
import { Input, Select, DatePicker } from "@/components/ui/form";
import { CloseSquare } from "iconsax-reactjs";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Expired", value: "expired" },
];

const BILLING_FREQUENCY_OPTIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Termly", value: "termly" },
  { label: "Annually", value: "annually" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Multi-Year", value: "multi-year" },
  { label: "Custom", value: "custom" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "Paid", value: "paid" },
  { label: "Not invoiced", value: "not_invoiced" },
  { label: "Invoice issued", value: "invoice_issued" },
  { label: "Partially paid", value: "partially_paid" },
  { label: "Waived", value: "waived" },
  { label: "Refunded", value: "refunded" },
  { label: "Overdue", value: "overdue" },
];

interface BillingDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  onSave: (data: BillingDetailsFormValues) => void;
  defaultValues?: Partial<BillingDetailsFormValues>;
}

const BillingDetailsModal = ({
  open,
  onOpenChange,
  planName,
  onSave,
  defaultValues,
}: BillingDetailsModalProps) => {
  const methods = useForm<BillingDetailsFormValues>({
    resolver: zodResolver(billingDetailsSchema),
    defaultValues: {
      status: "",
      startDate: "",
      endDate: "",
      billingFrequency: "",
      paymentStatus: "",
      billingContactName: "",
      billingContactOrganization: "",
      billingContactEmail: "",
      billingAddress: "",
      purchaseOrderReference: "",
      taxIdentifier: "",
      ...defaultValues,
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: BillingDetailsFormValues) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-8">
          <DialogPrimitive.Popup className="relative my-auto grid w-full max-w-[701px] shrink-0 gap-8 rounded-2xl bg-white p-4 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:p-6">
            <DialogPrimitive.Close className="absolute right-2 top-2 sm:-right-5 sm:-top-5">
              <CloseSquare size={24} variant="Bulk" color="#433E3F" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            <div className="flex min-h-[60px] w-full items-center justify-between text-left">
              <DialogPrimitive.Title className="text-[24px] font-semibold leading-[1.2] text-neutrals-900">
                Billing Details
              </DialogPrimitive.Title>
            </div>

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full min-w-0 flex-col gap-6"
              >
                <div className="flex flex-col gap-4">
                  <span className="text-[16px] font-normal leading-[1.2] text-neutrals-700">
                    PLAN DETAILS
                  </span>

                  <input
                    readOnly
                    value={planName}
                    className="h-14 w-full min-w-0 rounded-2xl bg-[#F5F5FF] px-5 text-[16px] text-neutrals-900"
                  />

                  <Select
                    name="status"
                    label="Status"
                    options={STATUS_OPTIONS}
                  />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <DatePicker name="startDate" label="Start date" />
                    <DatePicker name="endDate" label="End date" />
                  </div>

                  <Select
                    name="billingFrequency"
                    label="Billing frequency"
                    options={BILLING_FREQUENCY_OPTIONS}
                  />

                  <Select
                    name="paymentStatus"
                    label="Payment status"
                    options={PAYMENT_STATUS_OPTIONS}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <span className="text-[16px] font-normal leading-[1.2] text-neutrals-700">
                    BILLING DETAILS
                  </span>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input
                      name="billingContactName"
                      label="Billing contact name"
                    />

                    <Input
                      name="billingContactOrganization"
                      label="Billing contact organization"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input
                      name="billingContactEmail"
                      label="Billing contact email"
                    />

                    <Input name="billingAddress" label="Billing address" />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input
                      name="purchaseOrderReference"
                      label="Purchase order reference"
                    />

                    <Input
                      name="taxIdentifier"
                      label="Tax identifier"
                    />
                  </div>
                </div>

                <div className="flex gap-6">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="flex h-13.5 flex-1 items-center justify-center gap-2.5 rounded-[28px] border border-primary px-8 py-4"
                  >
                    <span className="text-[16px] font-normal leading-[1.2] text-primary">
                      Cancel
                    </span>
                  </button>

                  <button
                    type="submit"
                    className="flex h-13.5 flex-1 items-center justify-center gap-2.5 rounded-[28px] border border-primary bg-primary px-8 py-4"
                  >
                    <span className="text-[16px] font-normal leading-[1.2] text-white">
                      Save Details
                    </span>
                  </button>
                </div>
              </form>
            </FormProvider>
          </DialogPrimitive.Popup>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default BillingDetailsModal;
