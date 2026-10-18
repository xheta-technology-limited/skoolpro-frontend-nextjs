"use client";
import { useEffect } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import { DatePicker, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSearchParams } from "next/navigation";
import { AddSquare } from "iconsax-reactjs";

import {
  AcademicYearFormData,
  academicYearSchema,
} from "@/features/academic-year";
import { zodResolver } from "@hookform/resolvers/zod";
import { SESSION_TYPE_OPTIONS } from "../../constants";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useCreateAcademicYear } from "@/features/academic-year/api/create-academic-year";
import { useUpdateAcademicYear } from "@/features/academic-year/api/update-academic-year";
import { useGetAcademicYears } from "@/features/academic-year/api/list-academic-years";
import { setFormErrors } from "@/lib/helpers/set-form-errors";
import { StepIcon } from "../modal-img";
import { useAcademicYearStore } from "@/features/academic-year/academic-year.store";

export default function CreateAcademicYear() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = !!editId;

  const methods = useForm<AcademicYearFormData>({
    defaultValues: {
      terms: [
        { name: "", starts_on: "", ends_on: "" },
        { name: "", starts_on: "", ends_on: "" },
        { name: "", starts_on: "", ends_on: "" },
      ],
    },
    resolver: zodResolver(academicYearSchema),
  });

  const { reset } = methods;

  const toISODateTime = (dateStr: string) =>
    dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`;

  const { data: academicYears } = useGetAcademicYears();
  const editYear = isEditMode
    ? academicYears?.find((y) => y.id === editId)
    : undefined;

  useEffect(() => {
    if (isEditMode && editYear) {
      reset({
        name: editYear.name,
        starts_on: toISODateTime(editYear.starts_on),
        ends_on: toISODateTime(editYear.ends_on),
        session_type: editYear.session_type as "term" | "semester",
        terms: editYear.terms.map((term) => ({
          name: term.name,
          starts_on: toISODateTime(term.starts_on),
          ends_on: toISODateTime(term.ends_on),
        })),
      });
    } else if (!isEditMode) {
      reset({
        name: "",
        starts_on: "",
        ends_on: "",
        session_type: undefined,
        terms: [
          { name: "", starts_on: "", ends_on: "" },
          { name: "", starts_on: "", ends_on: "" },
          { name: "", starts_on: "", ends_on: "" },
        ],
      });
    }
  }, [isEditMode, editYear, reset]);

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateAcademicYear();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateAcademicYear();

  const isPending = isCreatePending || isUpdatePending;

  const { fields } = useFieldArray({
    control: methods.control,
    name: "terms",
  });

  const onSubmit = (data: AcademicYearFormData) => {
    if (isEditMode && editId) {
      updateMutate(
        { yearId: editId, data },
        {
          onSuccess: () =>
            router.replace(
              "/super-admin/school-onboarding/academic-year?open=true&step=3"
            ),
          onError: (res) => setFormErrors(methods.setError, res.errors),
        }
      );
    } else {
      createMutate(data, {
        onSuccess: () =>
          router.replace(
            "/super-admin/school-onboarding/academic-year?open=true&step=2"
          ),
        onError: (res) => setFormErrors(methods.setError, res.errors),
      });
    }
  };

  const open = searchParams.get("open");
  const current = searchParams.get("step");
  const isOpen = open === "true" && current === "1";

  const handleClose = () => {
    router.replace("/super-admin/school-onboarding/academic-year");
  };

  return (
    <>
      <FormModal
        title={isEditMode ? "Edit Academic Year" : "Create Academic Year"}
        open={isOpen}
        icon={<StepIcon stage={1} />}
        onOpenChange={() =>
          router.replace("/super-admin/school-onboarding/academic-year")
        }
      >
        <FormProvider {...methods}>
          <form
            className="flex flex-col sm:h-auto gap-6 w-full"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <Input name="name" label="Enter academic year name" />
            <div className="flex gap-4 *:flex-1">
              <DatePicker name="starts_on" label="Start date" />
              <DatePicker name="ends_on" label="End date" />
            </div>

            <Text className="text-neutrals-700" scale={"content"}>
              Session type
            </Text>
            <Select
              options={SESSION_TYPE_OPTIONS}
              name="session_type"
              label="Select session type"
            />

            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-4">
                <Input
                  name={`terms.${index}.name`}
                  label={`Enter ${["first", "second", "third"][index]} term`}
                />
                <div className="flex gap-4 *:flex-1">
                  <DatePicker
                    name={`terms.${index}.starts_on`}
                    label="Start date"
                  />
                  <DatePicker
                    name={`terms.${index}.ends_on`}
                    label="End date"
                  />
                </div>
              </div>
            ))}

            <div className="flex *:flex-1 gap-6">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                loading={isPending}
                type="submit"
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              >
                {isEditMode ? "Save Changes" : "Continue"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </FormModal>
    </>
  );
}

export function OpenModalButton() {
  const router = useProgressRouter();
  const { isPending } = useGetAcademicYears();
  const lastAcademicYear = useAcademicYearStore(
    (state) => state.lastAcademicYear
  );
  return (
    <Button
      size="lg"
      disabled={isPending}
      className="h-12 w-full gap-2 rounded-[28px] px-8 py-3.5 sm:w-auto sm:min-w-68.5"
      onClick={() => {
        if (lastAcademicYear) {
          router.push(
            `/super-admin/school-onboarding/academic-year?open=true&id=${lastAcademicYear.id}`
          );
        } else {
          router.push(
            "/super-admin/school-onboarding/academic-year?open=true&step=1"
          );
        }
      }}
    >
      <AddSquare variant="Bulk" size={20} />
      <span>Create Academic Year</span>
    </Button>
  );
}
