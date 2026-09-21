"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";
import FormModal from "@/components/ui/form-modal";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useCreateEnrolment } from "@/features/user-management/student-management/api/create-enrolment";
import { useGetClassSections } from "@/features/user-management/student-management/api/get-class-sections";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { useGetAcademicYears } from "@/features/academic-year/api/list-academic-years";

const enrollStudentSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required"),
  classToEnroll: z.string().min(1, "Class is required"),
  classSection: z.string().min(1, "Class/Section is required"),
  rollNumber: z.string().optional(),
});

type EnrollStudentValues = z.infer<typeof enrollStudentSchema>;

interface EnrollStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
}

export default function EnrollStudentModal({
  open,
  onOpenChange,
  studentId,
}: EnrollStudentModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<EnrollStudentValues>({
    resolver: zodResolver(enrollStudentSchema),
    defaultValues: {
      academicYear: "",
      classToEnroll: "",
      classSection: "",
      rollNumber: "",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState,
    watch,
    setValue,
  } = methods;

  const createEnrolmentMutation = useCreateEnrolment();

  const { data: educationLevels } = useListLevels();
  const { data: classSections } = useGetClassSections();
  const { data: academicYears } = useGetAcademicYears();

  const selectedLevelId = watch("classToEnroll");

  const levelOptions = (educationLevels ?? []).map((level) => ({
    value: level.id,
    label: level.name,
  }));

  const academicYearOptions = (academicYears ?? []).map((year) => ({
    value: year.id,
    label: year.name,
  }));

  const sectionOptions = (classSections ?? [])
    .filter(
      (section) =>
        !selectedLevelId ||
        section.education_level_id === selectedLevelId
    )
    .map((section) => ({
      value: section.id,
      label: section.name,
    }));

  useEffect(() => {
    const currentSection = classSections?.find(
      (section) => section.id === watch("classSection")
    );

    if (
      selectedLevelId &&
      currentSection &&
      currentSection.education_level_id !== selectedLevelId
    ) {
      setValue("classSection", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLevelId, classSections]);

  const onSubmit = async (values: EnrollStudentValues) => {
    try {
      const response = await createEnrolmentMutation.mutateAsync({
        student_id: studentId,
        class_section_id: values.classSection,
        academic_year_id: values.academicYear,
        ...(values.rollNumber
          ? { roll_number: values.rollNumber }
          : {}),
      });

      await queryClient.invalidateQueries({
        queryKey: ["enrolments"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      if (response.meta?.over_capacity) {
        toast.warning(
          "Student was enrolled, but the class is now over capacity."
        );
      }

      toast.success("Student enrolled successfully.");

      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to enroll student:", error);

      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to enroll student. Please try again.";

      toast.error(message);
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
      title="Enroll Student"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <span className="text-[14px] font-medium text-neutrals-900">
            Enroll to
          </span>

          <Select
            name="academicYear"
            placeholder="Academic year"
            options={academicYearOptions}
          />

          <Select
            name="classToEnroll"
            placeholder="Class"
            options={levelOptions}
          />

          <Select
            name="classSection"
            placeholder="Class/Section"
            options={sectionOptions}
          />

          <Input name="rollNumber" label="Roll number" />

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
                formState.isSubmitting ||
                createEnrolmentMutation.isPending
              }
              className="h-14 flex-1"
            >
              Enroll Student
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}
