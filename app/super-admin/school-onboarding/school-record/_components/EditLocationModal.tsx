"use client";

import { useEffect } from "react";
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

const editLocationSchema = z.object({
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

type EditLocationValues = z.infer<typeof editLocationSchema>;

interface EditLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  campus: Campus | null;
}

// TODO: latitude/longitude are part of the update-campus payload per
// the API spec but aren't shown as fields in this form's design. Since
// PUT campuses is a confirmed partial update, they're simply never
// sent from this modal — the backend leaves them untouched. If a
// future design adds fields for them, add corresponding dirtyFields
// checks in the mutation below.
export default function EditLocationModal({
  open,
  onOpenChange,
  schoolId,
  campus,
}: EditLocationModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<EditLocationValues>({
    resolver: zodResolver(editLocationSchema),
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
  const { dirtyFields } = formState;

  useEffect(() => {
    if (campus && open) {
      reset({
        name: campus.name ?? "",
        code: campus.code ?? "",
        addressLine1: campus.address_line_1 ?? "",
        city: campus.city ?? "",
        stateProvince: campus.state_province ?? "",
        postalCode: campus.postal_code ?? "",
        landmark: campus.landmark ?? "",
        timezone: campus.timezone ?? "",
        studentCapacity:
          campus.student_capacity != null
            ? String(campus.student_capacity)
            : "",
        isPrimary: campus.is_primary ?? false,
      });
    }
  }, [campus, open, reset]);

  const updateCampusMutation = useMutation<
    { data: Campus },
    ServerErrorResponse,
    EditLocationValues
  >({
    mutationFn: (values) => {
      if (!campus) {
        return Promise.reject(new Error("No campus selected"));
      }

      const payload: Record<string, unknown> = {};

      if (dirtyFields.name) payload.name = values.name;
      if (dirtyFields.code) payload.code = values.code;
      if (dirtyFields.isPrimary) payload.is_primary = values.isPrimary;
      if (dirtyFields.addressLine1) payload.address_line_1 = values.addressLine1;
      if (dirtyFields.city) payload.city = values.city;
      if (dirtyFields.stateProvince) payload.state_province = values.stateProvince;
      if (dirtyFields.postalCode) payload.postal_code = values.postalCode;
      if (dirtyFields.landmark) payload.landmark = values.landmark || undefined;
      if (dirtyFields.timezone) payload.timezone = values.timezone;
      if (dirtyFields.studentCapacity) {
        payload.student_capacity = values.studentCapacity
          ? Number(values.studentCapacity)
          : undefined;
      }

      return api.put(`schools/${schoolId}/campuses/${campus.id}`, payload);
    },
  });

  const onSubmit = async (values: EditLocationValues) => {
    if (!campus) {
      return;
    }

    try {
      await updateCampusMutation.mutateAsync(values);
      await queryClient.invalidateQueries({
        queryKey: schoolProfileKeys.all,
      });
      toast.success("Location updated successfully.");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update location:", error);
      toast.error("Failed to update location. Please try again.");
    }
  };

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Location"
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
              loading={formState.isSubmitting || updateCampusMutation.isPending}
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