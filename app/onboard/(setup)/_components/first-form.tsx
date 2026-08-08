"use client";
import { Input, Select, DragNDrop } from "@/components/ui/form";
import DatePickerInput from "@/components/ui/form/date-picker/date-picker";
import { africanCountries } from "@/lib/utils/countries-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { firstFormSchema } from "@/features/onboard/schemas";
import type { FirstFormData } from "@/features/onboard/schemas";
import { Button } from "@/components/ui/custom-button";
import { Dispatch, SetStateAction } from "react";

type Props = {
  setPhase: Dispatch<SetStateAction<number>>;
};
export default function FirstForm({ setPhase }: Props) {
  const methods = useForm<FirstFormData>({
    defaultValues: {},
    resolver: zodResolver(firstFormSchema),
  });
  const onSubmit = () => {
    setPhase((prev) => prev + 1);
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-125"
      >
        <Input name="school_name" label="School Name" />
        <Input name="display_name" label="Enter display name" />
        <Input name="registration_number" label="Enter registration number" />
        <Select
          name="country"
          label="Select country"
          options={africanCountries}
        />

        <Input name="authority" label="Enter issuing authority" />
        <DatePickerInput name="expiry_date" label="Enter expiry date" />
        <DragNDrop name="file" label="registration" />
        <Button className="self-end">Next</Button>
      </form>
    </FormProvider>
  );
}
