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
import { fourthFormSchema } from "@/features/onboard/schemas";
import type { FourthFormData } from "@/features/onboard/schemas";
import { Button } from "@/components/ui/custom-button";
import { ownershipTypes, schoolTypes } from "@/lib/utils/school-type-list";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  setPhase: Dispatch<SetStateAction<number>>;
};
export default function FourthForm({ setPhase }: Props) {
  const methods = useForm<FourthFormData>({
    defaultValues: {},
    resolver: zodResolver(fourthFormSchema),
  });
  const onSubmit = () => {
    toast("whooptidoo!");
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-125"
      >
        <Input name="motto" label="Enter school motto" />
        <DragNDrop name="logo" label="school logo" />
        <DragNDrop name="license" label="school license" />
        <DragNDrop name="letterhead" label="school letterhead" />
        <Button className="self-end">Submit</Button>
      </form>
    </FormProvider>
  );
}
