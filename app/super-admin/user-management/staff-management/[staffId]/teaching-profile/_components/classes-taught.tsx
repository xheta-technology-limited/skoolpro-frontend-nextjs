"use client";
import { use, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import { CompactCheckbox } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { Spinner } from "@/components/animations";
import { AddSquare } from "iconsax-reactjs";
import Item from "./item";
import { useListClassSections } from "@/features/academic-year/api/list-class-sections";
import { Section } from "@/features/user-management/staff-management/types/api/teaching-profile";

interface Props {
  selectedClasses: Section[];
  onAddClasses: (classes: Section[]) => void;
  isEditMode: boolean;
}
export default function ClassesTaught({
  selectedClasses,
  onAddClasses,
  isEditMode,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: sections, isPending } = useListClassSections({
    enabled: isEditMode,
  });

  const methods = useForm<{ section_ids: string[] }>({
    defaultValues: { section_ids: selectedClasses.map((sec) => sec.id) },
  });

  useEffect(() => {
    if (isOpen)
      methods.reset({ section_ids: selectedClasses.map((sec) => sec.id) });
  }, [isOpen, selectedClasses, methods]);

  // useEffect(() => {
  //   console.log("le classes: ", selectedClasses);
  // }, [selectedClasses]);

  const onSubmit = (data: { section_ids: string[] }) => {
    onAddClasses(
      (sections ?? [])
        .filter((section) => data.section_ids.includes(section.id))
        .map((section) => ({
          id: section.id,
          name: section.name,
          code: section.code,
        }))
    );
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Text className="text-neutrals-700">CLASSES TAUGHT</Text>

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
        {selectedClasses.map((section) => (
          <Item
            key={section.id}
            label={section.name}
            onButtonClick={() =>
              onAddClasses(
                selectedClasses.filter((sec) => sec.id !== section.id)
              )
            }
          />
        ))}
      </div>

      <FormModal open={isOpen} onOpenChange={setIsOpen} title="Add Classes">
        {isPending ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size={48} />
          </div>
        ) : (
          <>
            <FormProvider {...methods}>
              <form
                id="add-classes-form"
                className="flex flex-col gap-4"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col gap-4 bg-primary-bg rounded-ml p-2 max-h-96 overflow-y-auto">
                  {sections?.map((section) => (
                    <CompactCheckbox
                      key={section.id}
                      id={section.id}
                      name="section_ids"
                      label={section.name}
                      value={section.id}
                    />
                  ))}
                </div>
              </form>
            </FormProvider>

            <div className="flex gap-6 *:flex-1">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="add-classes-form">
                Add
              </Button>
            </div>
          </>
        )}
      </FormModal>
    </div>
  );
}
