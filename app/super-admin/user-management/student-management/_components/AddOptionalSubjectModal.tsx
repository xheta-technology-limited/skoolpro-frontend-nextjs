"use client";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Add } from "iconsax-reactjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import FormModal from "@/components/ui/form-modal";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";

interface EffectiveSubject {
  assignment_id: string;
  subject_name: string;
  source: string;
  pass_mark: number;
}

interface AddOptionalSubjectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrolmentId?: string;
  subjects: EffectiveSubject[];
}

interface AddOptionalSubjectsValues {
  subjects: {
    subjectName: string;
    passMark: string;
  }[];
}

const DEFAULT_VALUES: AddOptionalSubjectsValues = {
  subjects: [
    {
      subjectName: "",
      passMark: "",
    },
  ],
};

export default function AddOptionalSubjectsModal({
  open,
  onOpenChange,
  enrolmentId,
  subjects,
}: AddOptionalSubjectsModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<AddOptionalSubjectsValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append } = useFieldArray({
    control,
    name: "subjects",
  });

  const addOptionalSubjectMutation = useMutation<
    unknown,
    ServerErrorResponse,
    {
      enrolmentId: string;
      subjectLevelAssignmentId: string;
    }
  >({
    mutationFn: ({ enrolmentId, subjectLevelAssignmentId }) =>
      api.post(`enrolments/${enrolmentId}/subjects`, {
        subject_level_assignment_id: subjectLevelAssignmentId,
      }),
  });

  const optionalSubjects = subjects.filter(
    (subject) => subject.source === "optional"
  );

  const subjectOptions = optionalSubjects.map((subject) => ({
    label: subject.subject_name,
    value: subject.assignment_id,
  }));

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(DEFAULT_VALUES);
    }

    onOpenChange(nextOpen);
  };

  const handleAddSubject = () => {
    append({
      subjectName: "",
      passMark: "",
    });
  };

  const onSubmit = async (values: AddOptionalSubjectsValues) => {
    if (!enrolmentId) {
      toast.error("No current enrolment found.");
      return;
    }

    try {
      for (const subject of values.subjects) {
        if (!subject.subjectName) {
          continue;
        }

        await addOptionalSubjectMutation.mutateAsync({
          enrolmentId,
          subjectLevelAssignmentId: subject.subjectName,
        });
      }

      await queryClient.invalidateQueries();

      toast.success("Optional subject added successfully.");
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to add optional subject:", error);
      toast.error("Failed to add optional subject. Please try again.");
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Add Optional Subjects"
      maxWidth="max-w-170"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6"
        >
          <div className="flex flex-col gap-3">
            <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1">
              Add a subject
            </span>

            <div className="flex flex-col gap-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  <Input
                    name={`subjects.${index}.subjectName`}
                    label="Enter subject name"
                    />

                  <Input
                    name={`subjects.${index}.passMark`}
                    label="Enter pass mark"
                    type="number"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddSubject}
              className="flex h-8.25 items-center gap-2 rounded-full border border-primary px-5 text-[14px] font-medium text-primary transition-colors hover:bg-primary/5"
            >
              <Add
                size={16}
                variant="Linear"
                className="text-primary"
              />

              Add Subject
            </button>
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
              className="h-14 flex-1 rounded-[28px]"
              loading={addOptionalSubjectMutation.isPending}
            >
              Add Subject
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}
