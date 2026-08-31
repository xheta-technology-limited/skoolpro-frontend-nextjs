"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";
import FormModal from "@/components/ui/form-modal";
import { Button } from "@/components/ui/custom-button";
import ColorField from "@/app/onboarding/_components/fields/ColorField";

import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { schoolProfileKeys } from "@/features/school-profile/api/query-keys";
import type { UpdateSchoolProfilePayload } from "../types";

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const editColorCodeSchema = z.object({
  primaryColor: z.string().regex(HEX_COLOR_REGEX, "Enter a valid hex color"),
  primaryColorSwatch: z.string().optional(),
  secondaryColor: z.string().regex(HEX_COLOR_REGEX, "Enter a valid hex color"),
  secondaryColorSwatch: z.string().optional(),
  accentColor: z.string().regex(HEX_COLOR_REGEX, "Enter a valid hex color"),
  accentColorSwatch: z.string().optional(),
  textColor: z.string().regex(HEX_COLOR_REGEX, "Enter a valid hex color"),
  textColorSwatch: z.string().optional(),
});

type EditColorCodeValues = z.infer<typeof editColorCodeSchema>;

interface ColorCodeProfile {
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  text_color: string | null;
}

interface EditColorCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
  profile: ColorCodeProfile | null;
}

export default function EditColorCodeModal({
  open,
  onOpenChange,
  schoolId,
  profile,
}: EditColorCodeModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<EditColorCodeValues>({
    resolver: zodResolver(editColorCodeSchema),
    defaultValues: {},
  });

  const { handleSubmit, reset, formState } = methods;
  const { dirtyFields } = formState;

  useEffect(() => {
    if (profile && open) {
      reset({
        primaryColor: profile.primary_color ?? "",
        primaryColorSwatch: profile.primary_color ?? "",
        secondaryColor: profile.secondary_color ?? "",
        secondaryColorSwatch: profile.secondary_color ?? "",
        accentColor: profile.accent_color ?? "",
        accentColorSwatch: profile.accent_color ?? "",
        textColor: profile.text_color ?? "",
        textColorSwatch: profile.text_color ?? "",
      });
    }
  }, [profile, open, reset]);

  const updateColorCodeMutation = useMutation<
    unknown,
    ServerErrorResponse,
    UpdateSchoolProfilePayload
  >({
    mutationFn: (data) => api.put(`schools/${schoolId}`, data),
  });

  const onSubmit = async (values: EditColorCodeValues) => {
    const payload: UpdateSchoolProfilePayload = {};

    if (dirtyFields.primaryColor) {
      payload.primary_color = values.primaryColor;
    }
    if (dirtyFields.secondaryColor) {
      payload.secondary_color = values.secondaryColor;
    }
    if (dirtyFields.accentColor) {
      payload.accent_color = values.accentColor;
    }
    if (dirtyFields.textColor) {
      payload.text_color = values.textColor;
    }

    if (Object.keys(payload).length === 0) {
      onOpenChange(false);
      return;
    }

    try {
      await updateColorCodeMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: schoolProfileKeys.all });
      toast.success("Color code updated successfully.");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update color code:", error);
      toast.error("Failed to update color code. Please try again.");
    }
  };

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Color Code"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <ColorField name="primaryColor" label="Primary color" />
          <ColorField name="secondaryColor" label="Secondary color" />
          <ColorField name="accentColor" label="Tertiary color" />
          <ColorField name="textColor" label="Accent color" />

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
              size="lg"
              loading={
                formState.isSubmitting || updateColorCodeMutation.isPending
              }
              className="flex-1"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}