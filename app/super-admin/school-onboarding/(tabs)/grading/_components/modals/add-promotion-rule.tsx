"use client";

import FormModal from "@/components/ui/form-modal";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePromotionRuleFormData,
  createPromotionRuleSchema,
} from "@/features/grade-scales/schemas/create-promotion-rule-schema";
import { useListStages } from "@/features/academic-year/api/list-stages";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { createSelectOptions, setFormErrors } from "@/lib/helpers";
import { useCreatePromotionRule } from "@/features/grade-scales/api/create-promotion-rule";
import { toast } from "sonner";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  defaults?: CreatePromotionRuleFormData;
}

export default function AddPromotionRule({
  isOpen,
  handleClose,
  defaults,
}: Props) {
  const methods = useForm<CreatePromotionRuleFormData>({
    defaultValues: defaults ?? {},
    resolver: zodResolver(createPromotionRuleSchema),
  });
  const { reset } = methods;

  useEffect(() => {
    reset(defaults ?? {});
  }, [defaults, isOpen, reset]);

  const { mutate, isPending } = useCreatePromotionRule();
  const selectedScope = useWatch({
    name: "scope",
    control: methods.control,
  });

  const { data: stages, isPending: isStagesPending } = useListStages({
    refetchOnWindowFocus: false,
    enabled: selectedScope === "stage",
  });
  const stageOptions = createSelectOptions(stages, "id", "name");

  const { data: levels, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
    enabled: selectedScope === "level",
  });
  const levelOptions = createSelectOptions(levels, "id", "name");

  const onSubmit = (data: CreatePromotionRuleFormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success(defaults ? "Edited!" : "Created!");
        methods.reset();
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
      title={defaults ? "Edit Rule" : "Add Rule"}
    >
      <FormProvider {...methods}>
        <form
          id="promotion-rule-create"
          className="flex flex-col gap-4 w-full"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Select
            name="scope"
            label="Select scope"
            options={[
              { value: "school", label: "General (whole school)" },
              { value: "stage", label: "Program (a stage)" },
              { value: "level", label: "A specific class" },
            ]}
          />

          {selectedScope === "stage" && (
            <Select
              name="education_stage_id"
              label="Select stage"
              options={stageOptions || []}
              isLoading={isStagesPending}
            />
          )}
          {selectedScope === "level" && (
            <Select
              name="education_level_id"
              label="Select class"
              options={levelOptions || []}
              isLoading={isLevelsPending}
            />
          )}

          <Input label="Enter minimum average" name="minimum_average" />
          <Input
            label="Enter attendance requirement(%)"
            name="attendance_requirement"
          />
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="promotion-rule-create"
            loading={isPending}
          >
            {defaults ? "Edit Rule" : "Create Rule"}
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
