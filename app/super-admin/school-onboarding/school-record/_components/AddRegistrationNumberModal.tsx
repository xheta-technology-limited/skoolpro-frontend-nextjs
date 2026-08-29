"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";
import FormModal from "@/components/ui/form-modal";
import { Input, DatePicker } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import CountrySelectField from "@/app/onboarding/_components/fields/CountrySelectField";

import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { schoolProfileKeys } from "@/features/school-profile/api/query-keys";
import type { RegistrationNumber } from "../types";

const addRegistrationNumberSchema = z.object({
  number: z.string().min(1, "Registration number is required"),
  countryCode: z.string().min(1, "Country is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

type AddRegistrationNumberValues = z.infer<
  typeof addRegistrationNumberSchema
>;

interface AddRegistrationNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
}

export default function AddRegistrationNumberModal({
  open,
  onOpenChange,
  schoolId,
}: AddRegistrationNumberModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<AddRegistrationNumberValues>({
    resolver: zodResolver(addRegistrationNumberSchema),
    defaultValues: {
      number: "",
      countryCode: "",
      issuingAuthority: "",
      expiryDate: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const createRegistrationMutation = useMutation<
    { data: RegistrationNumber },
    ServerErrorResponse,
    AddRegistrationNumberValues
  >({
    mutationFn: (values) =>
      api.post(`schools/${schoolId}/registration-numbers`, {
        country_code: values.countryCode,
        number: values.number,
        issuing_authority: values.issuingAuthority,
        expiry_date: values.expiryDate,
      }),
  });

  const onSubmit = async (values: AddRegistrationNumberValues) => {
    try {
      await createRegistrationMutation.mutateAsync(values);
      await queryClient.invalidateQueries({
        queryKey: schoolProfileKeys.all,
      });
      toast.success("Registration number added successfully.");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add registration number:", error);
      toast.error("Failed to add registration number. Please try again.");
    }
  };

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  }

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Add Registration Number"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <Input name="number" label="Enter registration number" />

          <CountrySelectField name="countryCode" placeholder="Select country" />

          <Input name="issuingAuthority" label="Enter issuing authority" />

          <DatePicker name="expiryDate" label="Enter expiry date" />

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
              loading={formState.isSubmitting || createRegistrationMutation.isPending}
              className="h-14 flex-1 rounded-[28px]"
            >
              Add Reg. No.
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}