"use client";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import { CompactCheckbox } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { Spinner } from "@/components/animations";
import { AddSquare } from "iconsax-reactjs";
import Item from "./item";
import { useListSubjects } from "@/features/academic-year/api/list-subjects";

interface Props {
  selectedSubjectIds: string[];
  onAddSubjects: (subjectIds: string[]) => void;
  isEditMode: boolean;
}
export default function SubjectsTaught({
  selectedSubjectIds,
  onAddSubjects,
  isEditMode,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: subjects, isPending } = useListSubjects();

  const taughtSubjects = (subjects ?? []).filter((subject) =>
    selectedSubjectIds.includes(subject.id)
  );

  const methods = useForm<{ subject_ids: string[] }>({
    defaultValues: { subject_ids: selectedSubjectIds },
  });

  useEffect(() => {
    if (isOpen) methods.reset({ subject_ids: selectedSubjectIds });
  }, [isOpen, selectedSubjectIds, methods]);

  const onSubmit = (data: { subject_ids: string[] }) => {
    onAddSubjects(data.subject_ids);
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Text className="text-neutrals-700">SUBJECTS TAUGHT</Text>

        {isEditMode && (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={
              <AddSquare variant="Bulk" size={16} className="text-primary" />
            }
            onClick={() => setIsOpen(true)}
          >
            Add
          </Button>
        )}
      </div>

      <div className="rounded-ml bg-primary-bg gap-4 p-2 flex flex-col">
        {taughtSubjects.map((subject) => (
          <Item
            key={subject.id}
            label={subject.name}
            onButtonClick={() =>
              onAddSubjects(
                selectedSubjectIds.filter((id) => id !== subject.id)
              )
            }
          />
        ))}
      </div>

      <FormModal open={isOpen} onOpenChange={setIsOpen} title="Add Subject">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size={48} />
          </div>
        ) : (
          <>
            <FormProvider {...methods}>
              <form
                id="add-subject-form"
                className="flex flex-col gap-4"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-4 bg-primary-bg rounded-ml p-2 max-h-96 overflow-y-auto">
                  {subjects?.map((subject) => (
                    <CompactCheckbox
                      key={subject.id}
                      id={subject.id}
                      name="subject_ids"
                      label={subject.name}
                      value={subject.id}
                    />
                  ))}
                </div>
              </form>
            </FormProvider>

            <div className="flex gap-6 *:flex-1">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="add-subject-form">
                Add
              </Button>
            </div>
          </>
        )}
      </FormModal>
    </div>
  );
}