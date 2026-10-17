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
import { createSelectOptions, setFormErrors, titleCase } from "@/lib/helpers";
import { GradeScale } from "@/features/grade-scales/types/api/grade-scale";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { EducationLevel, SubjectAssignment } from "@/features/academic-year";
import { useListLevelSubjectAssignments } from "@/features/academic-year/api/list-level-overview";
import { useCreateGradingScheme } from "@/features/grade-scales/api/create-grading-scheme";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { useListCurrentTerms } from "@/features/academic-year/api/list-current-terms";
import { Term } from "@/features/academic-year/types/api/terms";

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
  const selectedScope = useWatch({
    name: "scope_type",
    control: methods.control,
  });
  const selectedLevel = useWatch({
    name: "education_level_id",
    control: methods.control,
  });

  const { data: educationLevels, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
    enabled:
      selectedScope === "level" || selectedScope === "subject_assignment",
  });
  const levelOptions = createSelectOptions<EducationLevel, "id", "name">(
    educationLevels,
    "id",
    "name"
  );

  const { data: subjectAssignments, isPending: isAssignmentsPending } =
    useListLevelSubjectAssignments(selectedLevel || "", {
      refetchOnWindowFocus: false,
      enabled: !!selectedLevel,
    });
  const subjectOptions = subjectAssignments?.map((sub) => ({
    value: sub.id,
    label: titleCase(sub.subject.name),
  }));

  const { data: terms, isPending: isTermsPending } = useListCurrentTerms({
    refetchOnWindowFocus: false,
  });
  const termOptions = createSelectOptions<Term, "id", "name">(
    terms,
    "id",
    "name"
  );

  useEffect(() => {
    methods.setValue("subject_level_assignment_id", undefined);
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedScope !== "level" && selectedScope !== "subject_assignment") {
      methods.setValue("education_level_id", undefined);
    }
    if (selectedScope !== "subject_assignment") {
      methods.setValue("subject_level_assignment_id", undefined);
    }
  }, [selectedScope]);

  useEffect(() => {
    console.log("le sub options: ", subjectOptions);
  }, [subjectAssignments, subjectOptions]);
  const { mutate, isPending } = useCreateGradingScheme();

  const onSubmit = (data: CreateGradingSchemeFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Created!");
        handleClose();
      },
      onError: (err) => {
        setFormErrors(methods.setError, err.errors);
      },
    });
  };

  return (
    <FormModal
      onOpenChange={handleClose}
      open={isOpen}
      title="Add Grading Scheme"
    >
      <FormProvider {...methods}>
        <form
          id="scheme-create"
          className="flex flex-col gap-4 w-full"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Input name="name" label="Enter scheme name" />
          <Select
            name="scope_type"
            label="Select scope"
            options={[
              { value: "school", label: "School (default)" },
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
            <div className="flex gap-2 flex-wrap w-full *:flex-1">
              <Select
                name="education_level_id"
                label="Select level"
                options={levelOptions || []}
                isLoading={isLevelsPending}
              />
              <Select
                name="subject_level_assignment_id"
                label="Select subject level"
                isLoading={isAssignmentsPending}
                disabled={selectedLevel ? false : true}
                options={subjectOptions || []}
              />
            </div>
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
            isLoading={isTermsPending}
            options={termOptions || []}
          />
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="scheme-create" loading={isPending}>
            Create Scheme
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
