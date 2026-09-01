"use client";
import { useEffect } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import { DatePicker, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSearchParams } from "next/navigation";

import {
  AcademicYearFormData,
  academicYearSchema,
} from "@/features/academic-year";
import { zodResolver } from "@hookform/resolvers/zod";
import { SESSION_TYPE_OPTIONS } from "../../constants";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useGenerateAcademicYearDraft } from "@/features/academic-year/api/generate-academic-year-draft";
import { useApproveAcademicYearDraft } from "@/features/academic-year/api/approve-academic-year-draft";
import { useUpdateAcademicYear } from "@/features/academic-year/api/update-academic-year";
import { useDiscardDraft } from "@/features/academic-year/api/discard-draft";
import { Spinner } from "@/components/animations";
import { AcademicYear } from "@/features/academic-year";
import { toast } from "sonner";
import { generateFormDate } from "@/lib/helpers/generate-form-date";

const MAX_YEARS = new Date().getFullYear() + 3;

const toFormData = (year: AcademicYear): AcademicYearFormData => ({
  name: year.name,
  starts_on: generateFormDate(year.starts_on),
  ends_on: generateFormDate(year.ends_on),
  session_type: year.session_type as "term" | "semester",
  terms: year.terms.map((term) => ({
    name: term.name,
    starts_on: generateFormDate(term.starts_on),
    ends_on: generateFormDate(term.ends_on),
  })),
});

export default function ReviewAcademicYear() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
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

  const {
    mutate: generateMutate,
    isPending: isGeneratePending,
    data,
  } = useGenerateAcademicYearDraft();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateAcademicYear();
  const { mutate: approveMutate, isPending: isApprovePending } =
    useApproveAcademicYearDraft();
  const { mutate: discardMutate, isPending: isDiscardPending } =
    useDiscardDraft();

  const open = searchParams.get("open");
  const id = searchParams.get("id");
  const isOpen = open === "true" && !!id && id !== "";

  useEffect(() => {
    if (isOpen && id) {
      generateMutate({ academicYearID: id });
    }
  }, [isOpen, id, generateMutate]);

  useEffect(() => {
    if (data) {
      reset(toFormData(data));
    }
  }, [data, reset]);

  const { fields } = useFieldArray({
    control: methods.control,
    name: "terms",
  });
  const onSubmit = (values: AcademicYearFormData) => {
    if (!data) {
      return;
    }
    const original = toFormData(data);
    const hasChanges = JSON.stringify(values) !== JSON.stringify(original);
    if (hasChanges) {
      updateMutate(
        { yearId: data.id, data: values },
        {
          onSuccess: () =>
            approveMutate(
              { academicYearID: data.id },
              {
                onSuccess: () => {
                  toast.success(
                    "Academic year updated and approved successfully"
                  );
                  router.replace(
                    "/super-admin/school-onboarding/academic-year"
                  );
                },
              }
            ),
        }
      );
    } else {
      approveMutate(
        { academicYearID: data.id },
        {
          onSuccess: () => {
            toast.success("Academic year approved and added successfully");
            router.replace("/super-admin/school-onboarding/academic-year");
          },
        }
      );
    }
  };
  const discard = () => {
    if (!data) {
      return;
    }
    discardMutate(
      { academicYearID: data.id },
      {
        onSuccess: () => {
          toast.success("Draft discarded");
          router.replace(
            "/super-admin/school-onboarding/academic-year?open=true&step=1"
          );
        },
      }
    );
  };

  return (
    <>
      <FormModal
        title="Review Academic Year Draft"
        open={isOpen}
        onOpenChange={() =>
          router.replace("/super-admin/school-onboarding/academic-year")
        }
      >
        {isGeneratePending ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size={48} />
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              className="flex flex-col sm:h-auto gap-6 w-full"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <Input name="name" label="Enter academic year name" />
              <div className="flex gap-4 *:flex-1">
                <DatePicker
                  name="starts_on"
                  label="Start date"
                  maxYears={MAX_YEARS}
                />
                <DatePicker
                  name="ends_on"
                  label="End date"
                  maxYears={MAX_YEARS}
                />
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
                    name={`terms[${index}].name`}
                    label={`Enter ${["first", "second", "third"][index]} term`}
                  />
                  <div className="flex gap-4 *:flex-1">
                    <DatePicker
                      name={`terms[${index}].starts_on`}
                      label="Start date"
                      maxYears={MAX_YEARS}
                    />
                    <DatePicker
                      name={`terms[${index}].ends_on`}
                      label="End date"
                      maxYears={MAX_YEARS}
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
                  onClick={discard}
                  loading={isDiscardPending}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
                  loading={isUpdatePending || isApprovePending}
                >
                  Approve
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
      </FormModal>
    </>
  );
}
