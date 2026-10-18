"use client";

import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { usePathname, useSearchParams } from "next/navigation";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  CreateGradeScaleFormData,
  createGradeScaleSchema,
} from "@/features/grade-scales/schemas/create-grade-scale-schema";
import { BooleanSelect, Input, Select } from "@/components/ui/form";
import { useState } from "react";
import { TickSquare } from "iconsax-reactjs";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateGradeScale } from "@/features/grade-scales/api/create-grade-scale";
import { setFormErrors } from "@/lib/helpers";
import { toast } from "sonner";

//TODO: Make this also double as editing a grade scale
export default function AddGradeScaleModal() {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const [isAddBands, setAddBands] = useState(false);

  const isOpen =
    params.includes("/grading") &&
    searchParams.get("add-grade-scale") === "true";
  const isEditMode = isOpen && searchParams.get("scale-id");

  const handleClose = () =>
    router.push("/super-admin/school-onboarding/grading");

  const methods = useForm<CreateGradeScaleFormData>({
    defaultValues: {},
    resolver: zodResolver(createGradeScaleSchema),
  });
  const { fields } = useFieldArray({
    control: methods.control,
    name: "bands",
  });

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateGradeScale();

  const onSubmit = (data: CreateGradeScaleFormData) => {
    createMutate(data, {
      onError: (res) => {
        setFormErrors(methods.setError, res.errors);
      },
      onSuccess: () => {
        toast.success("Scale added successfully");
        handleClose();
      },
    });
  };
  return (
    <FormModal onOpenChange={handleClose} open={isOpen} title="Add Grade Scale">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          id="grade-scale-create"
          className="flex flex-col gap-4 w-full"
        >
          <Input name="name" label="Enter grade name" />
          <BooleanSelect
            name="is_default"
            label="Set as default"
            trueLabel="Yes"
            falseLabel="No"
          />
          <BooleanSelect
            name="is_active"
            label="Select status"
            trueLabel="Active"
            falseLabel="Inactive"
          />

          <button
            type="button"
            className="flex gap-2 mb-4"
            onClick={() => setAddBands((prev) => !prev)}
          >
            <TickSquare
              variant={isAddBands ? "Bulk" : "Outline"}
              size={24}
              color={isAddBands ? "#0301FF" : "#726C6C"}
            />
            <Text className="text-neutrals-700" scale="content">
              Add bands after creating scale
            </Text>
          </button>
          {isAddBands && (
            <>
              <div className="flex gap-4">
                <Input label="Enter band label" name="bands.0.label" />
                <Input label="Enter minimum score" name="bands.0.min_score" />
                <Input label="Enter maximum score" name="bands.0.max_score" />
              </div>

              <Input label="Enter grade point" name="bands.0.grade_point" />
              <BooleanSelect
                label="Select pass or fail"
                name="bands.0.is_pass"
                trueLabel="Pass"
                falseLabel="Fail"
              />
              <Input label="Enter description" name="bands.0.description" />
              <Input
                label="Enter longer remark for report card"
                name="bands.0.comment"
              />
            </>
          )}
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            loading={isCreatePending}
            type="submit"
            form="grade-scale-create"
          >
            Create Grade
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
