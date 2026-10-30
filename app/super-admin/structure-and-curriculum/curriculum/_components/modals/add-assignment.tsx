"use client";

import { Button } from "@/components/ui/custom-button";
import { BooleanSelect, Input, Select } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useAssignSubjectToLevel } from "@/features/academic-year/api/assign-subject-to-level";
import { useListArms } from "@/features/academic-year/api/list-arms";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { useListSubjects } from "@/features/academic-year/api/list-subjects";
import { useUpdateSubjectAssignment } from "@/features/academic-year/api/update-subject-assignment";
import { assignSubjectSchema } from "@/features/academic-year/schemas/assign-subject-schema";
import { SubjectAssignment } from "@/features/academic-year/types/api/subject-assignments";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SCOPE_OPTIONS = [
  { value: "whole_level", label: "Whole level" },
  { value: "one_class", label: "One class only" },
];

const assignmentSchema = assignSubjectSchema
  .extend({
    scope: z.enum(["whole_level", "one_class"]),
  })
  .refine((data) => data.scope === "whole_level" || !!data.class_section_id, {
    message: "Please select a class",
    path: ["class_section_id"],
  });

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface Props {
  defaults?: SubjectAssignment;
}

const getDefaultValues = (defaults?: SubjectAssignment): AssignmentFormData => {
  if (!defaults) {
    return {
      subject_id: "",
      education_level_id: "",
      scope: "whole_level",
      is_active: true,
    };
  }

  return {
    subject_id: defaults.subject_id,
    education_level_id: defaults.education_level_id,
    class_section_id: defaults.class_section_id ?? undefined,
    scope: defaults.is_whole_level ? "whole_level" : "one_class",
    is_compulsory: defaults.is_compulsory,
    pass_mark: String(defaults.pass_mark),
    is_active: defaults.is_active,
  };
};

export default function AddAssignment({ defaults }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();
  const assignmentId = searchParams.get("assignment-id");

  const methods = useForm<AssignmentFormData>({
    defaultValues: getDefaultValues(defaults),
    resolver: zodResolver(assignmentSchema),
  });

  const { mutate: assignMutate, isPending: isAssignPending } =
    useAssignSubjectToLevel();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateSubjectAssignment();

  const isOpen =
    pathname.includes("/structure-and-curriculum") &&
    searchParams.get("add-assignment") === "true";
  const isEditMode = isOpen && !!assignmentId;

  const { data: subjectsData, isPending: isSubjectsPending } = useListSubjects(
    undefined,
    { refetchOnWindowFocus: false }
  );
  const subjectOptions = createSelectOptions(subjectsData, "id", "name");

  const { data: levelsData, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const levelOptions = createSelectOptions(levelsData, "id", "name");

  const selectedLevel = useWatch({
    control: methods.control,
    name: "education_level_id",
  });
  const scope = useWatch({ control: methods.control, name: "scope" });

  const { data: armsData, isPending: isArmsPending } = useListArms(
    selectedLevel,
    {
      refetchOnWindowFocus: false,
      enabled: !!selectedLevel && scope === "one_class",
    }
  );
  const armOptions = createSelectOptions(armsData, "id", "name");

  const handleClose = () =>
    router.push(
      "/super-admin/structure-and-curriculum/curriculum?tab=subject-assignments"
    );

  const onCreate = (data: AssignmentFormData) => {
    const { scope, ...payload } = data;
    assignMutate(
      {
        subjectId: data.subject_id,
        data: {
          ...payload,
          class_section_id:
            scope === "one_class" ? payload.class_section_id : undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Subject assigned successfully");
          methods.reset(getDefaultValues());
          handleClose();
        },
        onError: (err) => {
          setFormErrors(methods.setError, err.errors);
        },
      }
    );
  };

  const onUpdate = (data: AssignmentFormData) => {
    if (!assignmentId) {
      toast.error("No assignment ID found");
      return;
    }
    updateMutate(
      {
        assignmentId,
        data: {
          is_compulsory: data.is_compulsory,
          pass_mark: data.pass_mark,
          is_active: data.is_active,
        },
      },
      {
        onSuccess: () => {
          toast.success("Updated!");
          handleClose();
        },
        onError: (err) => {
          setFormErrors(methods.setError, err.errors);
        },
      }
    );
  };

  const onSubmit = (data: AssignmentFormData) => {
    if (isEditMode) {
      onUpdate(data);
    } else {
      onCreate(data);
    }
  };

  useEffect(() => {
    methods.reset(getDefaultValues(defaults));
  }, [defaults, methods]);

  return (
    <FormModal
      onOpenChange={handleClose}
      open={isOpen}
      title={isEditMode ? "Edit Subject Assignment" : "Assign Subject"}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          id="assignment-create"
          className="flex flex-col gap-4 w-full"
        >
          {!isEditMode && (
            <>
              <Select
                name="subject_id"
                label="Select subject"
                options={subjectOptions || []}
                isLoading={isSubjectsPending}
              />
              <Select
                name="education_level_id"
                label="Select level"
                options={levelOptions || []}
                isLoading={isLevelsPending}
                disabled={isEditMode}
              />
              <Select
                name="scope"
                label="Select scope"
                options={SCOPE_OPTIONS}
                disabled={isEditMode}
              />
            </>
          )}

          {scope === "one_class" && (
            <Select
              name="class_section_id"
              label="Select class"
              options={armOptions || []}
              isLoading={isArmsPending && !!selectedLevel}
              disabled={isEditMode}
            />
          )}
          <BooleanSelect
            name="is_compulsory"
            label="Select requirement"
            trueLabel="Compulsory"
            falseLabel="Elective"
          />
          <Input name="pass_mark" label="Enter pass mark" type="number" />
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            loading={isAssignPending || isUpdatePending}
            type="submit"
            form="assignment-create"
          >
            {isEditMode ? "Save changes" : "Assign subject"}
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
