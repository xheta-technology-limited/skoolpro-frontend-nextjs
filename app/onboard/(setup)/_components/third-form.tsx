"use client";
import {
  Input,
  Select,
  DragNDrop,
  Checkbox,
  TextArea,
} from "@/components/ui/form";
import DatePickerInput from "@/components/ui/form/date-picker/date-picker";
import { africanCountries } from "@/lib/utils/countries-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { thirdFormSchema } from "@/features/onboard/schemas";
import type { ThirdFormData } from "@/features/onboard/schemas";
import { Button } from "@/components/ui/custom-button";
import { ownershipTypes, schoolTypes } from "@/lib/utils/school-type-list";
import { Dispatch, SetStateAction } from "react";
import clsx from "clsx";

type Props = {
  setPhase: Dispatch<SetStateAction<number>>;
};
export default function ThirdForm({ setPhase }: Props) {
  const methods = useForm<ThirdFormData>({
    defaultValues: {},
    resolver: zodResolver(thirdFormSchema),
  });
  const primaryColor = useWatch({
    control: methods.control,
    name: "primary_hex_code",
  });
  const secondaryColor = useWatch({
    control: methods.control,
    name: "secondary_hex_code",
  });
  const tertiaryColor = useWatch({
    control: methods.control,
    name: "tertiary_hex_code",
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
        <Input name="school_address" label="Enter school address" />
        <Input
          name="second_school_address"
          label="Enter a second school address"
        />
        <Input name="telephone_number" label="Enter a telephone number" />
        <Input name="email_address" label="Enter email address" />
        <Input name="school_website" label="Enter school website" />
        <Input name="social_media_account" label="Enter social media account" />
        <div className="flex gap-3 w-full">
          <div className="flex-1">
            <Input
              name="primary_hex_code"
              label="Primary school hex code color"
            />
          </div>
          <HexViewer color={primaryColor} />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              name="secondary_hex_code"
              label="Secondary school hex code color"
            />
          </div>
          <HexViewer color={secondaryColor} />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              name="tertiary_hex_code"
              label="Tertiary school hex code color"
            />
          </div>
          <HexViewer color={tertiaryColor} />
        </div>

        <Button className="self-end">Next</Button>
      </form>
    </FormProvider>
  );
}

type HexProps = {
  color: string;
};
const HexViewer = ({ color }: HexProps) => {
  return (
    <div
      className="rounded-ml border-4 border-[#F5F5FF] w-20 max-h-12.75"
      style={{ backgroundColor: color }}
    />
  );
};
