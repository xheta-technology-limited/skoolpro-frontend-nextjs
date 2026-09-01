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
import { Spinner } from "@/components/animations";
import { StepIcon } from "../modal-img";

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

  const { mutate, isPending, data } = useGenerateAcademicYearDraft();

  const open = searchParams.get("open");
  const id = searchParams.get("id");
  const isOpen = open === "true" && !!id && id !== "";

  useEffect(() => {
    if (isOpen && id) {
      mutate({ academicYearID: id });
    }
  }, [isOpen, id, mutate]);

  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        starts_on: data.starts_on,
        ends_on: data.ends_on,
        session_type: data.session_type as "term" | "semester",
        terms: data.terms.map((term) => ({
          name: term.name,
          starts_on: term.starts_on,
          ends_on: term.ends_on,
        })),
      });
    }
  }, [data, reset]);

  const { fields } = useFieldArray({
    control: methods.control,
    name: "terms",
  });
  const onSubmit = () => {
    alert("Do some api stuff");
  };
  const discard = () => {
    alert("Do some api stuff and redirect step 1");
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
        {isPending ? (
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
                    name={`terms[${index}].name`}
                    label={`Enter ${["first", "second", "third"][index]} term`}
                  />
                  <div className="flex gap-4 *:flex-1">
                    <DatePicker
                      name={`terms[${index}].starts_on`}
                      label="Start date"
                    />
                    <DatePicker
                      name={`terms[${index}].ends_on`}
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
                  onClick={discard}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
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
