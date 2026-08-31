"use client";

import { useEffect } from "react";
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

const editContactSchema = z.object({
  type: z.string().min(1, "Contact type is required"),
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  isPrimary: z.boolean(),
});

type EditContactValues = z.infer<typeof editContactSchema>;

interface UpdateContactPayload {
  type?: string;
  label?: string;
  value?: string;
  is_primary?: boolean;
}

interface EditContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  contact: Contact | null;
}

export default function EditContactModal({
  open,
  onOpenChange,
  schoolId,
  contact,
}: EditContactModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<EditContactValues>({
    resolver: zodResolver(editContactSchema),
    defaultValues: {
      isPrimary: false,
    },
  });

  const { handleSubmit, reset, control, formState } = methods;
  const { dirtyFields } = formState;

  useEffect(() => {
    if (contact && open) {
      reset({
        type: contact.type ?? "",
        label: contact.label ?? "",
        value: contact.value ?? "",
        isPrimary: contact.is_primary ?? false,
      });
    }
  }, [contact, open, reset]);

  const updateContactMutation = useMutation<
    unknown,
    ServerErrorResponse,
    { contactId: string; data: UpdateContactPayload }
  >({
    mutationFn: ({ contactId, data }) =>
      api.put(`schools/${schoolId}/contacts/${contactId}`, data),
  });

  const onSubmit = async (values: EditContactValues) => {
    if (!contact) {
      return;
    }

    const payload: UpdateContactPayload = {};

    if (dirtyFields.type) {
      payload.type = values.type;
    }
    if (dirtyFields.label) {
      payload.label = values.label;
    }
    if (dirtyFields.value) {
      payload.value = values.value;
    }
    if (dirtyFields.isPrimary) {
      payload.is_primary = values.isPrimary;
    }

    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }

    try {
      await updateContactMutation.mutateAsync({
        contactId: contact.id,
        data: payload,
      });
      await queryClient.invalidateQueries({ queryKey: schoolProfileKeys.all });
      toast.success("Contact updated successfully.");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update contact:", error);
      toast.error("Failed to update contact. Please try again.");
    }
  };

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <FormModal open={open} onOpenChange={handleOpenChange} title="Edit Contact">
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
              loading={formState.isSubmitting || updateContactMutation.isPending}
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