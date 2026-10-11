"use client";

import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { usePathname, useSearchParams } from "next/navigation";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  CreateGradeScaleFormData,
  createGradeScaleSchema,
} from "@/features/grade-scales/schemas/create-grade-scale-schema";
import { Input, Select } from "@/components/ui/form";
import { useState } from "react";
import { TickSquare } from "iconsax-reactjs";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";

//TODO: Make this also double as editing a grade scale
export default function AddGradeScaleModal() {
  const params = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const [isAddBands, setAddBands] = useState(false);

  const isOpen =
    params.includes("/grading") &&
    searchParams.get("add-grade-scale") === "true";

  const handleClose = () =>
    router.push("/super-admin/school-onboarding/grading");

  const methods = useForm<CreateGradeScaleFormData>({
    defaultValues: {},
    resolver: zodResolver(createGradeScaleSchema),
  });

  return (
    <FormModal onOpenChange={handleClose} open={isOpen} title="Add Grade Scale">
      <FormProvider {...methods}>
        <form id="grade-scale-create" className="flex flex-col gap-4 w-full">
          <Input name="name" label="Enter grade name" />
          <Select
            name="is_default"
            label="Set as default"
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
          />
          <Select
            name="is_active"
            label="Select status"
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
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
                <Input label="Enter grade" name="label" />
                <Input label="Enter minimum score" name="min_score" />
                <Input label="Enter maximum score" name="max_score" />
              </div>

              <Input label="Enter grade point" name="grade_point" />
              <Select
                label="Select pass or fail"
                name="is_pass"
                options={[
                  { value: "true", label: "Pass" },
                  { value: "false", label: "Fail" },
                ]}
              />
              <Input label="Enter description" name="description" />
              <Input
                label="Enter longer remark for report card"
                name="comment"
              />
            </>
          )}
        </form>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="grade-scale-create"
            onClick={() => alert("some api stuff")}
          >
            Create Grade
          </Button>
        </div>
      </FormProvider>
    </FormModal>
  );
}
