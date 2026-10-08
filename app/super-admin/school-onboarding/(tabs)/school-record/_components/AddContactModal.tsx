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
import type { Contact } from "../types";

const CONTACT_TYPE_OPTIONS = [
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Social media", value: "social_media" },
  { label: "Website", value: "website" },
];

const addContactSchema = z.object({
  type: z.string().min(1, "Contact type is required"),
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  isPrimary: z.boolean(),
});

type AddContactValues = z.infer<typeof addContactSchema>;

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
}

export default function AddContactModal({
  open,
  onOpenChange,
  schoolId,
}: AddContactModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<AddContactValues>({
    resolver: zodResolver(addContactSchema),
    defaultValues: {
      isPrimary: false,
    },
  });

  const { handleSubmit, reset, control, formState } = methods;

  const createContactMutation = useMutation<
    { data: Contact },
    ServerErrorResponse,
    AddContactValues
  >({
    mutationFn: (values) =>
      api.post(`schools/${schoolId}/contacts`, {
        type: values.type,
        label: values.label,
        value: values.value,
        is_primary: values.isPrimary,
      }),
  });

  const onSubmit = async (values: AddContactValues) => {
    try {
      await createContactMutation.mutateAsync(values);
      await queryClient.invalidateQueries({
        queryKey: schoolProfileKeys.all,
      });
      toast.success("Contact added successfully.");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add contact:", error);
      toast.error("Failed to add contact. Please try again.");
    }
  };

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  }

  return (
    <FormModal open={open} onOpenChange={handleOpenChange} title="Add Contact">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <Select
            name="type"
            placeholder="Select contact type"
            options={CONTACT_TYPE_OPTIONS}
          />

          <Input name="label" label="Enter label" />

          <Input name="value" label="Enter value" />

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
              loading={formState.isSubmitting || createContactMutation.isPending}
              className="h-14 flex-1 rounded-[28px]"
            >
              Add Contact
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}