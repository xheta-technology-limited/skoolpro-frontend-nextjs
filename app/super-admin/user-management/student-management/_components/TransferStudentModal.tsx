"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";
import FormModal from "@/components/ui/form-modal";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { ApiError } from "@/lib/api";

import { useTransferEnrolment } from "@/features/user-management/student-management/api/transfer-enrolment";
import type { ClassSectionRecord } from "@/features/user-management/student-management/types/class-section-types";

const transferStudentSchema = z.object({
  transferTo: z.string().min(1, "Class is required"),
});

type TransferStudentValues = z.infer<typeof transferStudentSchema>;

interface TransferStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrolmentId: string | undefined;
  currentClassLabel: string;
  classSections: ClassSectionRecord[];
}

/**
 * Wired to POST /enrolments/{enrolment}/transfer via
 * useTransferEnrolment. meta.over_capacity (soft cap for the
 * destination section) surfaces as a warning toast alongside success,
 * same pattern as EnrollStudentModal/AdmitStudentModal.
 */
export default function TransferStudentModal({
  open,
  onOpenChange,
  enrolmentId,
  currentClassLabel,
  classSections,
}: TransferStudentModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<TransferStudentValues>({
    resolver: zodResolver(transferStudentSchema),
    defaultValues: {
      transferTo: "",
    },
  });

  const { handleSubmit, reset, formState } = methods;

  const transferEnrolmentMutation = useTransferEnrolment();

  const classSectionOptions = classSections.map((section) => ({
    label: section.name,
    value: section.id,
  }));

  const onSubmit = async (values: TransferStudentValues) => {
    if (!enrolmentId) {
      toast.error("No active enrolment to transfer.");
      return;
    }

    try {
      const response = await transferEnrolmentMutation.mutateAsync({
        enrolmentId,
        payload: { class_section_id: values.transferTo },
      });

      await queryClient.invalidateQueries({ queryKey: ["enrolments"] });
      await queryClient.invalidateQueries({ queryKey: ["students"] });


      if (response.meta?.over_capacity) {
        toast.warning(
          "Student was transferred, but the destination class is now over capacity."
        );
      }

      toast.success("Student transferred successfully.");
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to transfer student:", error);

      // request() in @/lib/api already toasts non-401 ApiErrors before
      // throwing, so only toast here for errors it wouldn't have shown.
      if (!(error instanceof ApiError)) {
        const message =
          error && typeof error === "object" && "message" in error
            ? String((error as { message: unknown }).message)
            : "Failed to transfer student. Please try again.";
        toast.error(message);
      }
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
      title="Transfer Student"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium text-neutrals-900">
              Current class
            </span>
            <div className="flex h-13 items-center rounded-2xl bg-primary-bg px-5">
              <span className="text-[14px] text-neutrals-700">
                {currentClassLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-medium text-neutrals-900">
              Transfer to
            </span>
            <Select
              name="transferTo"
              placeholder="Class to enroll in"
              options={classSectionOptions}
            />
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
              size="lg"
              loading={
                formState.isSubmitting || transferEnrolmentMutation.isPending
              }
              className="h-14 flex-1"
            >
              Transfer Student
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}