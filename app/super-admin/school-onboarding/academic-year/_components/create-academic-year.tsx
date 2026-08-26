"use client";
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
import { SESSION_TYPE_OPTIONS } from "../constants";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";

export default function CreateAcademicYear() {
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

  const { fields } = useFieldArray({
    control: methods.control,
    name: "terms",
  });
  const onSubmit = () => {
    alert("clicked fr fr");
  };
  const open = searchParams.get("open");
  const current = searchParams.get("step");
  const isOpen = open === "true" && current === "1";

  return (
    <>
      <FormModal
        title="Create Academic Year"
        open={isOpen}
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

            <Text scale={"content"}>Session type</Text>
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              >
                Continue
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
  return (
    <Button
      size="lg"
      className="h-12 w-full gap-2 rounded-[28px] px-8 py-3.5 sm:w-auto sm:min-w-68.5"
      onClick={() =>
        router.push(
          "/super-admin/school-onboarding/academic-year?open=true&step=1"
        )
      }
    >
      <AddSquare variant="Bulk" size={20} />
      <span>Create Academic Year</span>
    </Button>
  );
}
