"use client";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Add } from "iconsax-reactjs";

import FormModal from "@/components/ui/form-modal";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";

interface AddOptionalSubjectsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}: AddOptionalSubjectsModalProps) {
  const methods = useForm<AddOptionalSubjectsValues>({
    defaultValues: DEFAULT_VALUES,
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append } = useFieldArray({
    control,
    name: "subjects",
  });

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

  const onSubmit = (values: AddOptionalSubjectsValues) => {
    console.log("Optional subjects:", values);
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
            >
              Add Subject
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}