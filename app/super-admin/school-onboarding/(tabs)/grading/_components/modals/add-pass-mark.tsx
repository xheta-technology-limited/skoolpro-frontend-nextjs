"use client";

import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { usePathname, useSearchParams } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Input, Select } from "@/components/ui/form";
import { InfoCircle, TickSquare } from "iconsax-reactjs";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePassMarkFormData,
  createPassMarkSchema,
} from "@/features/grade-scales/schemas/create-pass-mark-schema";
import { useListClassSections } from "@/features/academic-year/api/list-class-sections";
import { useListStages } from "@/features/academic-year/api/list-stages";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { useCreatePassMark } from "@/features/grade-scales/api/create-pass-mark";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  defaults?: CreatePassMarkFormData;
}
export default function AddPassMark({ isOpen, handleClose, defaults }: Props) {
  const methods = useForm<CreatePassMarkFormData>({
    defaultValues: {},
    resolver: zodResolver(createPassMarkSchema),
  });
  const { mutate, isPending } = useCreatePassMark();
  const selectedScope = useWatch({
    name: "scope",
    control: methods.control,
  });

  const { data: classSections, isPending: isSectionsPending } =
    useListClassSections({
      refetchOnWindowFocus: false,
      enabled: selectedScope === "class",
    });
  const classOptions = createSelectOptions(classSections, "id", "name");
  const { data: stages, isPending: isStagesPending } = useListStages({
    refetchOnWindowFocus: false,
    enabled: selectedScope === "programme",
  });
  const stageOptions = createSelectOptions(stages, "id", "name");

  const onSubmit = (data: CreatePassMarkFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Created!");
        methods.reset();
        handleClose();
      },
      onError: (err) => {
        setFormErrors(methods.setError, err.errors);
      },
    });
  };

  return (
    <FormModal onOpenChange={handleClose} open={isOpen} title="Set Pass Mark">
      <FormProvider {...methods}>
        <form
          id="pass-mark-create"
          className="flex flex-col gap-4 w-full"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Select
            name="scope"
            label="Select scope"
            options={[
              { value: "general", label: "General (whole school)" },
              { value: "programme", label: "Program (a stage)" },
              { value: "class", label: "A specific class" },
            ]}
          />

          {selectedScope === "class" && (
            <Select
              name="class_section_id"
              label="Select class"
              isLoading={isSectionsPending}
              options={classOptions || []}
            />
          )}
          {selectedScope === "programme" && (
            <Select
              name="education_stage_id"
              label="Select stage"
              options={stageOptions || []}
              isLoading={isStagesPending}
            />
          )}
          <Input label="Enter pass mark(0 - 100)" name="mark" />

          <div className="flex items-center gap-2">
            <InfoCircle variant="Bulk" size={24} color="#0301FF" />
            <Text scale={"content"} className="text-neutrals-700">
              The subject-level pass mark is set in the Curriculum module, on
              the subject itself — not here.
            </Text>
          </div>
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="pass-mark-create" loading={isPending}>
            Create Pass Mark
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
