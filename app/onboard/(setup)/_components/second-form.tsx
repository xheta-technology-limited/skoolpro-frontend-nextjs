"use client";
import { Input, Select, Checkbox, TextArea } from "@/components/ui/form";
import DatePickerInput from "@/components/ui/form/date-picker/date-picker";
import { africanCountries } from "@/lib/utils/countries-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { secondFormSchema } from "@/features/onboard/schemas";
import type { SecondFormData } from "@/features/onboard/schemas";
import { Button } from "@/components/ui/custom-button";
import { ownershipTypes, schoolTypes } from "@/lib/utils/school-type-list";
import { Dispatch, SetStateAction } from "react";
import { useOnboardForm } from "@/features/onboard/onboarding-store";

type Props = {
  setPhase: Dispatch<SetStateAction<number>>;
};
export default function SecondForm() {
  const setStep = useOnboardForm((state) => state.updateStep);
  const methods = useForm<SecondFormData>({
    defaultValues: {},
    resolver: zodResolver(secondFormSchema),
  });

  const onSubmit = () => {
    setStep(2);
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-125"
      >
        <Input name="education_authority" label="Enter education authority" />
        <Select
          name="authority_country"
          label="Select country"
          options={africanCountries}
        />
        <Checkbox
          name="school_type"
          label="Select shool type"
          options={schoolTypes}
        />
        <Select
          name="ownership_type"
          label="Select ownership type"
          options={ownershipTypes}
        />

        <DatePickerInput
          name="establishment_date"
          label="Enter date of establishment"
        />
        <TextArea
          maxLength={200}
          name="school_description"
          label="Enter school description"
        />
        <Button className="self-end">Next</Button>
      </form>
    </FormProvider>
  );
}
