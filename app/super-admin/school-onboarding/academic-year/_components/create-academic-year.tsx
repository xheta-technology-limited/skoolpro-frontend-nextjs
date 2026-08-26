import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { Text } from "@/components/ui";
import { DatePicker, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import Link from "next/link";
import { linkVariants } from "@/styles";
import {
  AcademicYearFormData,
  academicYearSchema,
} from "@/features/academic-year";
import { zodResolver } from "@hookform/resolvers/zod";
import { SESSION_TYPE_OPTIONS } from "../constants";

export default function CreateAcademicYear() {
  const methods = useForm<AcademicYearFormData>({
    defaultValues: {
      terms: [
        { name: "First Term", starts_on: "", ends_on: "" },
        { name: "Second Term", starts_on: "", ends_on: "" },
        { name: "Third Term", starts_on: "", ends_on: "" },
      ],
    },
    resolver: zodResolver(academicYearSchema),
  });

  const { fields } = useFieldArray({
    control: methods.control,
    name: "terms",
  });

  return (
    <>
      <FormProvider {...methods}>
        <form
          className="flex flex-col sm:h-auto gap-6 w-125"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Input name="name" label="Enter academic year name" />
          <div className="flex gap-4">
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
                name={`terms.${index}.name`}
                label="Enter term name"
              />
              <div className="flex gap-4">
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

          <Button
            size="lg"
            className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
          >
            Create Academic Year
          </Button>
        </form>
      </FormProvider>
    </>
  );
}
