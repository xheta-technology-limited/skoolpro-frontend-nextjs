"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input, Select } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import {
  QualificationFormData,
  qualificationSchema,
} from "@/features/user-management/staff-management/schemas/add-qualification-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

interface Props {
  onOpenChange: () => void;
  open: boolean;
}
export default function QualificationModal({ open, onOpenChange }: Props) {
  const methods = useForm<QualificationFormData>({
    defaultValues: {},
    resolver: zodResolver(qualificationSchema),
  });
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Qualification"
    >
      <div className="flex flex-col gap-4">
        <Text scale={"content"} className="text-neutrals-700">
          DETAILS
        </Text>

        <FormProvider {...methods}>
          <form className="flex flex-col gap-4 mb-4">
            <Select
              options={[
                { value: "academic", label: "Academic" },
                { value: "professional", label: "Professional" },
              ]}
              name="type"
              label="Enter qualification type"
            />

            <Input name="qualification" label="Enter qualification" />

            <Input name="institution" label="Enter awarding institution" />

            <Input name="award_date" label="Enter awarding year" type="date" />

            <Input name="grade" label="Enter grade" />

            <Input
              name="professional_registration"
              label="Enter registration number"
            />

            <Input name="expiry_date" label="Enter expiry date" type="date" />
          </form>
        </FormProvider>

        <div className="flex gap-6 *:flex-1">
          <Button onClick={onOpenChange} variant="secondary">
            Cancel
          </Button>
          <Button>Save</Button>
        </div>
      </div>
    </FormModal>
  );
}
