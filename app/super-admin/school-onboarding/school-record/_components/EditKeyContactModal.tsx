"use client";

import { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FormModal from "@/components/ui/form-modal";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import ToggleField from "@/app/onboarding/_components/fields/ToggleField";

import type { SchoolProfile } from "@/features/school-profile/types/school-profile";

type KeyContact = SchoolProfile["key_contacts"][number];

const ROLE_TYPE_OPTIONS = [
  { label: "Primary contact", value: "primary_contact" },
  { label: "Project lead", value: "project_lead" },
  { label: "Executive sponsor", value: "executive_sponsor" },
  { label: "Technical contact", value: "technical_contact" },
  { label: "Finance contact", value: "finance_contact" },
  { label: "Academic contact", value: "academic_contact" },
];

const editKeyContactSchema = z.object({
  roleType: z.string().min(1, "Role type is required"),
  fullName: z.string().min(1, "Full name is required"),
  jobTitle: z.string().min(1, "Role is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().optional(),
  isPrimary: z.boolean(),
});

type EditKeyContactValues = z.infer<typeof editKeyContactSchema>;

interface EditKeyContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyContact: KeyContact | null;
}

export default function EditKeyContactModal({
  open,
  onOpenChange,
  keyContact,
}: EditKeyContactModalProps) {
  const methods = useForm<EditKeyContactValues>({
    resolver: zodResolver(editKeyContactSchema),
    defaultValues: {
      isPrimary: false,
    },
  });

  const { handleSubmit, reset, control, formState } = methods;

  useEffect(() => {
    if (keyContact && open) {
      reset({
        roleType: keyContact.role_type ?? "",
        fullName: keyContact.full_name ?? "",
        jobTitle: keyContact.job_title ?? "",
        email: keyContact.email ?? "",
        phone: keyContact.phone ?? "",
        isPrimary: false,
      });
    }
  }, [keyContact, open, reset]);

  const onSubmit = async () => {
    console.log("TODO: no edit-key-contact endpoint yet — nothing was saved");
    onOpenChange(false);
  };

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Key Contact"
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
              loading={formState.isSubmitting}
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