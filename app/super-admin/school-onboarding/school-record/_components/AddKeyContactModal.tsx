"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";
import FormModal from "@/components/ui/form-modal";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import ToggleField from "@/app/onboarding/_components/fields/ToggleField";

import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { schoolProfileKeys } from "@/features/school-profile/api/query-keys";

const ROLE_TYPE_OPTIONS = [
  { label: "Primary contact", value: "primary_contact" },
  { label: "Project lead", value: "project_lead" },
  { label: "Executive sponsor", value: "executive_sponsor" },
  { label: "Technical contact", value: "technical_contact" },
  { label: "Finance contact", value: "finance_contact" },
  { label: "Academic contact", value: "academic_contact" },
  { label: "Data protection contact", value: "data_protection_contact" },
  { label: "Escalation level 1", value: "escalation_level_1" },
  { label: "Escalation level 2", value: "escalation_level_2" },
  { label: "Escalation level 3", value: "escalation_level_3" },
];

const addKeyContactSchema = z.object({
  roleType: z.string().min(1, "Role type is required"),
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().min(1, "Role is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().optional(),
  isPrimary: z.boolean(),
});

type AddKeyContactValues = z.infer<typeof addKeyContactSchema>;

interface AddKeyContactPayload {
  role_type: string;
  full_name: string;
  job_title: string;
  email: string;
  phone?: string;
  has_decision_making_authority: boolean;
}

interface AddKeyContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
}

export default function AddKeyContactModal({
  open,
  onOpenChange,
  schoolId,
}: AddKeyContactModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<AddKeyContactValues>({
    resolver: zodResolver(addKeyContactSchema),
    defaultValues: {
      isPrimary: false,
    },
  });

  const { handleSubmit, reset, control, formState } = methods;

  const createKeyContactMutation = useMutation<
    unknown,
    ServerErrorResponse,
    AddKeyContactPayload
  >({
    mutationFn: (data) => api.post(`schools/${schoolId}/key-contacts`, data),
  });

  const onSubmit = async (values: AddKeyContactValues) => {
    const payload: AddKeyContactPayload = {
      role_type: values.roleType,
      full_name: values.fullName,
      job_title: values.jobTitle,
      email: values.email,
      has_decision_making_authority: values.isPrimary,
    };

    if (values.phone) {
      payload.phone = values.phone;
    }

    try {
      await createKeyContactMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: schoolProfileKeys.all });
      toast.success("Key contact added successfully.");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add key contact:", error);
      toast.error("Failed to add key contact. Please try again.");
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
      title="Add Key Contact"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <Select
            name="roleType"
            placeholder="Select role type"
            options={ROLE_TYPE_OPTIONS}
          />

          <Input name="fullName" label="Enter full name" />

          <Input name="jobTitle" label="Enter role" />

          <Input name="email" label="Enter email" />

          <Input name="phone" label="Enter phone number" />

          <Controller
            name="isPrimary"
            control={control}
            render={({ field }) => (
              <ToggleField
                label="Set as primary contact"
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
              loading={
                formState.isSubmitting || createKeyContactMutation.isPending
              }
              className="h-14 flex-1 rounded-[28px]"
            >
              Add Key Contact
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}