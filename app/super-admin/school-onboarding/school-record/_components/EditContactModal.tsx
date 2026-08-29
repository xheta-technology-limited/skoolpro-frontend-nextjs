"use client";

import { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FormModal from "@/components/ui/form-modal";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import ToggleField from "@/app/onboarding/_components/fields/ToggleField";

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

interface EditContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
}

export default function EditContactModal({
  open,
  onOpenChange,
  contact,
}: EditContactModalProps) {
  const methods = useForm<EditContactValues>({
    resolver: zodResolver(editContactSchema),
    defaultValues: {
      type: "",
      label: "",
      value: "",
      isPrimary: false,
    },
  });

  const { handleSubmit, reset, control, formState } = methods;

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

  const onSubmit = async () => {
    console.log("TODO: no edit-contact endpoint yet — nothing was saved");
    onOpenChange(false);
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