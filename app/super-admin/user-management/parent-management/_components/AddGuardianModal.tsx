"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormModal from "@/components/ui/form-modal";
import { Input, Select, DragNDrop } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { SuccessModal } from "@/components/common";
import { useCreateGuardian } from "@/features/user-management/guardian-management/api/create-guardian";
import type { CreateGuardianPayload } from "@/features/user-management/guardian-management/types/create-guardian-types";

import {
  addGuardianSchema,
  DEFAULT_ADD_GUARDIAN_VALUES,
  GENDER_OPTIONS,
  PREFERRED_CONTACT_METHOD_OPTIONS,
  type AddGuardianValues,
} from "@/features/user-management/guardian-management/schemas/guardian-schema";

interface AddGuardianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string;
}

/**
 * NOTE: POST /guardians has no schoolId field in its confirmed payload
 * — like POST /students, the school is presumably inferred from the
 * session. schoolId is kept as a prop in case the caller/future
 * actions need it, but it's not sent in this mutation's body.
 *
 * NOTE: email OR phone is required (at least one) — a service-level
 * rule (422 if both are missing), not a plain per-field requirement.
 * Enforced client-side via superRefine in the schema; the server's
 * own message is surfaced on a 422 regardless.
 *
 * NOTE: the photo ID upload has no corresponding field in the
 * confirmed create-guardian payload — same "likely a dud for now"
 * situation as AdmitStudentModal's own photo upload. The control
 * stays in the UI but isn't sent anywhere.
 *
 * NOTE: "Nationality" is a Select per the design but has no real
 * options source yet (empty list) — see schema file for details.
 */
export default function AddGuardianModal({
  open,
  onOpenChange,
  schoolId,
}: AddGuardianModalProps) {
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const queryClient = useQueryClient();

  const methods = useForm<AddGuardianValues>({
    resolver: zodResolver(addGuardianSchema),
    defaultValues: DEFAULT_ADD_GUARDIAN_VALUES,
    mode: "onChange",
  });

  const { handleSubmit, reset, formState } = methods;
  const createGuardianMutation = useCreateGuardian();

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  }

  function extractErrorMessage(error: unknown, fallback: string): string {
    return error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : fallback;
  }

  function buildPayload(values: AddGuardianValues): CreateGuardianPayload {
    return {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email || undefined,
      phone: values.phone || undefined,
      title: values.title || undefined,
      middle_name: values.middleName || undefined,
      gender: values.gender || undefined,
      occupation: values.occupation || undefined,
      employer: values.employer || undefined,
      nationality: values.nationality || undefined,
      alt_phone: values.altPhone || undefined,
      home_address: values.homeAddress || undefined,
      work_address: values.workAddress || undefined,
      preferred_contact_method: values.preferredContactMethod || undefined,
    };
  }

  const onSubmit = async (values: AddGuardianValues) => {
    const payload = buildPayload(values);

    try {
      await createGuardianMutation.mutateAsync(payload);
      await queryClient.invalidateQueries({ queryKey: ["guardians"] });
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Failed to add guardian:", error);
      toast.error(
        extractErrorMessage(error, "Failed to add guardian. Please try again.")
      );
    }
  };

  function handleClose() {
    setIsSuccessOpen(false);
    handleOpenChange(false);
  }

  return (
    <>
      <FormModal open={open} onOpenChange={handleOpenChange} title="Add Guardian">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <div className="flex flex-col gap-3">
              <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1">
                PERSONAL DETAILS
              </span>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input name="title" label="Enter title" />
                <Input name="firstName" label="Enter first name" />
                <Input name="middleName" label="Enter middle name" />
                <Input name="lastName" label="Enter last name" />
                <Select
                  name="gender"
                  placeholder="Select gender"
                  options={GENDER_OPTIONS}
                />
                <Input
                  name="nationality"
                  label="Nationality"
                />
                <Input name="occupation" label="Occupation" />
                <Input name="employer" label="Employer" />
              </div>

              <DragNDrop name="photoId" label="photo ID" />
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1">
                CONTACT DETAILS
              </span>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input name="phone" label="Enter phone number" />
                <Input name="altPhone" label="Alt. phone number" />
                <Input name="email" label="Enter email address" />
                <Select
                  name="preferredContactMethod"
                  placeholder="Preferred contact method"
                  options={PREFERRED_CONTACT_METHOD_OPTIONS}
                />
                <Input name="homeAddress" label="Enter home address" />
                <Input name="workAddress" label="Enter work address" />
              </div>
            </div>

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
                loading={formState.isSubmitting || createGuardianMutation.isPending}
                className="h-14 flex-1 rounded-[28px]"
              >
                Add Guardian
              </Button>
            </div>
          </form>
        </FormProvider>
      </FormModal>

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={handleClose}
        subheading="The guardian was added successfully"
      >
        <div>
          <Button onClick={handleClose} size="md">
            Dismiss
          </Button>
        </div>
      </SuccessModal>
    </>
  );
}