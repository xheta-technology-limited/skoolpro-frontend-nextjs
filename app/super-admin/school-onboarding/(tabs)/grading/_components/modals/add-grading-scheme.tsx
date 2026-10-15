"use client";

import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { usePathname, useSearchParams } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateGradingSchemeFormData,
  createGradingSchemeSchema,
} from "@/features/grade-scales/schemas/create-grading-scheme-schema";
import { useListGradeScales } from "@/features/grade-scales/api/list-grade-scales";
import { createSelectOptions } from "@/lib/helpers";
import { GradeScale } from "@/features/grade-scales/types/api/grade-scale";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { EducationLevel } from "@/features/academic-year";
import { useListLevelSubjectAssignments } from "@/features/academic-year/api/list-level-overview";

export default function AddGradeSheme() {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const isOpen =
    params.includes("/grading") &&
    searchParams.get("add-grade-scheme") === "true";

  const handleClose = () =>
    router.push("/super-admin/school-onboarding/grading");

  const methods = useForm<CreateGradingSchemeFormData>({
    defaultValues: {},
    resolver: zodResolver(createGradingSchemeSchema),
  });

  const { data: gradeScales, isPending: isGradeScalePending } =
    useListGradeScales({ refetchOnWindowFocus: false });
  const gradeScaleOptions = createSelectOptions<GradeScale, "id", "name">(
    gradeScales,
    "id",
    "name"
  );

  const { data: educationLevels, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const levelOptions = createSelectOptions<EducationLevel, "id", "name">(
    educationLevels,
    "id",
    "name"
  );

  const { data: subjectAssignments, isPending: isAssignmentsPending } =
    useListLevelSubjectAssignments({ refetchOnWindowFocus: false });
  const levelOptions = createSelectOptions<EducationLevel, "id", "name">(
    educationLevels,
    "id",
    "name"
  );

  const selectedScope = useWatch({
    name: "scope_type",
    control: methods.control,
  });

  return (
    <FormModal
      onOpenChange={handleClose}
      open={isOpen}
      title="Add Grading Scheme"
    >
      <FormProvider {...methods}>
        <form id="scheme-create" className="flex flex-col gap-4 w-full">
          <Input name="name" label="Enter scheme name" />
          <Select
            name="scope_type"
            label="Select scope"
            options={[
              { value: "school", label: "School default" },
              { value: "level", label: "A specific level" },
              { value: "subject_assignment", label: "A specific subject" },
            ]}
          />

          {selectedScope === "level" && (
            <Select
              name="education_level_id"
              label="Select level"
              isLoading={isLevelsPending}
              options={levelOptions || []}
            />
          )}

          {selectedScope === "subject_assignment" && (
            <Select
              name="subject_level_assignment_id"
              label="Select subject level"
              options={[
                {
                  value: "subject_assignment",
                  label: "TODO: Fetch from backend",
                },
              ]}
            />
          )}
          <Select
            name="grade_scale_id"
            isLoading={isGradeScalePending}
            label="Select grade scale"
            options={gradeScaleOptions || []}
          />

          <Select
            name="academic_term_id"
            label="Applies to term"
            options={[{ value: "true", label: "TODO: Fetch from backend" }]}
          />
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="scheme-create"
            onClick={() => alert("some api stuff")}
          >
            Create Scheme
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
