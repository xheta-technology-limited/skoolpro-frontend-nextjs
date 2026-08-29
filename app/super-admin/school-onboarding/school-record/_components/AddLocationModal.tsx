"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";
import FormModal from "@/components/ui/form-modal";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import ToggleField from "@/app/onboarding/_components/fields/ToggleField";

import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { schoolProfileKeys } from "@/features/school-profile/api/query-keys";
import type { Campus } from "../types";

const addLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  landmark: z.string().optional(),
  timezone: z.string().min(1, "Timezone is required"),
  studentCapacity: z.string().optional(),
  isPrimary: z.boolean(),
});

type AddLocationValues = z.infer<typeof addLocationSchema>;

interface AddLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  // Country isn't a visible field in this form (per the Figma), but the
  // API requires it — pass the school's own country so new campuses
  // default to it rather than guessing a hardcoded value.
  countryCode: string;
}

// TODO: latitude/longitude are part of the add-campus payload per the
// API spec but aren't shown as fields in this form's design — omitted
// here until there's a field (or a map picker) for them.
export default function AddLocationModal({
  open,
  onOpenChange,
  schoolId,
  countryCode,
}: AddLocationModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<AddLocationValues>({
    resolver: zodResolver(addLocationSchema),
    defaultValues: {
      name: "",
      code: "",
      addressLine1: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      landmark: "",
      timezone: "",
      studentCapacity: "",
      isPrimary: false,
    },
  });

  const { handleSubmit, reset, control, formState } = methods;

  const createCampusMutation = useMutation<
    { data: Campus },
    ServerErrorResponse,
    AddLocationValues
  >({
    mutationFn: (values) =>
      api.post(`schools/${schoolId}/campuses`, {
        name: values.name,
        code: values.code,
        is_primary: values.isPrimary,
        address_line_1: values.addressLine1,
        city: values.city,
        state_province: values.stateProvince,
        postal_code: values.postalCode,
        country_code: countryCode,
        landmark: values.landmark || undefined,
        timezone: values.timezone,
        student_capacity: values.studentCapacity
          ? Number(values.studentCapacity)
          : undefined,
      }),
  });

  const onSubmit = async (values: AddLocationValues) => {
    try {
      await createCampusMutation.mutateAsync(values);
      await queryClient.invalidateQueries({
        queryKey: schoolProfileKeys.all,
      });
      toast.success("Location added successfully.");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add location:", error);
      toast.error("Failed to add location. Please try again.");
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
      title="Add Location"
      maxWidth="max-w-175.25"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input name="name" label="Enter name" />
            <Input name="code" label="Enter code" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input name="addressLine1" label="Enter address line 1" />
            <Input name="city" label="Enter city" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input name="stateProvince" label="Enter state" />
            <Input name="postalCode" label="Enter postal code" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input name="landmark" label="Enter landmark" />
            <Input name="timezone" label="Enter timezone" />
          </div>

          <Input name="studentCapacity" label="Enter student capacity" />

          <Controller
            name="isPrimary"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Set as primary location"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />

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
              loading={formState.isSubmitting || createCampusMutation.isPending}
              className="h-14 flex-1 rounded-[28px]"
            >
              Add Location
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}