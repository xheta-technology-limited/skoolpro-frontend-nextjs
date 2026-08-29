"use client";

import { useEffect } from "react";
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
import type {
  RegistrationNumber,
  UpdateRegistrationNumberPayload,
} from "../types";

const editRegistrationNumberSchema = z.object({
  number: z.string().min(1, "Registration number is required"),
  countryCode: z.string().min(1, "Country is required"),
  issuingAuthority: z.string().min(1, "Issuing authority is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

type EditRegistrationNumberValues = z.infer<
  typeof editRegistrationNumberSchema
>;

interface EditRegistrationNumberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  registration: RegistrationNumber | null;
}

export default function EditRegistrationNumberModal({
  open,
  onOpenChange,
  schoolId,
  registration,
}: EditRegistrationNumberModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<EditRegistrationNumberValues>({
    resolver: zodResolver(editRegistrationNumberSchema),
    defaultValues: {
      number: "",
      countryCode: "",
      issuingAuthority: "",
      expiryDate: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;
  const { dirtyFields } = formState;

  useEffect(() => {
    if (registration && open) {
      reset({
        number: registration.number ?? "",
        countryCode: registration.country_code ?? "",
        issuingAuthority: registration.issuing_authority ?? "",
        expiryDate: registration.expiry_date ?? "",
      });
    }
  }, [registration, open, reset]);

  const updateRegistrationMutation = useMutation<
    unknown,
    ServerErrorResponse,
    { registrationId: string; data: UpdateRegistrationNumberPayload }
  >({
    mutationFn: ({ registrationId, data }) =>
      api.put(
        `schools/${schoolId}/registration-numbers/${registrationId}`,
        data
      ),
  });

  const onSubmit = async (values: EditRegistrationNumberValues) => {
    if (!registration) {
      return;
    }

    try {
      const data: UpdateRegistrationNumberPayload = {
        country_code: values.countryCode,
        number: values.number,
      };

      if (dirtyFields.issuingAuthority) {
        data.issuing_authority = values.issuingAuthority;
      }

      if (dirtyFields.expiryDate) {
        data.expiry_date = values.expiryDate;
      }

      await updateRegistrationMutation.mutateAsync({
        registrationId: registration.id,
        data,
      });
      await queryClient.invalidateQueries({
        queryKey: schoolProfileKeys.all,
      });
      toast.success("Registration number updated successfully.");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update registration number:", error);
      toast.error("Failed to update registration number. Please try again.");
    }
  };

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Registration Number"
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
              loading={
                formState.isSubmitting || updateRegistrationMutation.isPending
              }
              className="h-14 flex-1 rounded-[28px]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}