"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { DatePicker, Input, Select } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useAddQualification } from "@/features/user-management/staff-management/api/add-qualification";
import { useUpdateQualification } from "@/features/user-management/staff-management/api/update-qualification";
import {
  QualificationFormData,
  qualificationSchema,
} from "@/features/user-management/staff-management/schemas/add-qualification-schema";
import { editQualificationSchema } from "@/features/user-management/staff-management/schemas/edit-qualification-schema";
import { StaffQualification } from "@/features/user-management/staff-management/types/api/qualification";
import { setFormErrors } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { FormProvider, useForm, Resolver } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

interface Props {
  onOpenChange: () => void;
  open: boolean;
  qualification?: StaffQualification | null;
}

const toIsoDatetime = (date?: string | null): string | undefined => {
  if (!date) return undefined;
  return date.includes("T") ? date : `${date}T00:00:00.000Z`;
};

const toFormDefaults = (
  qualification?: StaffQualification | null
): QualificationFormData => ({
  type: qualification?.type ?? "",
  qualification: qualification?.qualification ?? "",
  institution: qualification?.institution ?? undefined,
  grade: qualification?.grade ?? undefined,
  professional_registration:
    qualification?.professional_registration ?? undefined,
  award_date: toIsoDatetime(qualification?.award_date),
  expiry_date: toIsoDatetime(qualification?.expiry_date),
});

export default function QualificationModal({
  open,
  onOpenChange,
  qualification,
}: Props) {
  const isEdit = !!qualification;
  const { staffId } = useParams<{ staffId: string }>();

  const methods = useForm<QualificationFormData>({
    defaultValues: toFormDefaults(qualification),
    resolver: zodResolver(
      isEdit ? editQualificationSchema : qualificationSchema
    ) as Resolver<QualificationFormData>,
  });

  useEffect(() => {
    if (open) methods.reset(toFormDefaults(qualification));
  }, [open, qualification]);

  const { mutate: addMutate, isPending: isAddPending } =
    useAddQualification();
  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateQualification();

  const isPending = isEdit ? isUpdatePending : isAddPending;

  const onSubmit = (data: QualificationFormData) => {
    const onSuccess = () => {
      toast.success(isEdit ? "Qualification updated" : "Qualification added");
      onOpenChange();
    };
    const onError = (res: { message: string; errors?: Record<string, unknown> }) =>
      setFormErrors(methods.setError, res.errors);

    if (qualification) {
      updateMutate(
        { qualificationId: qualification.id, staffId, data },
        { onSuccess, onError }
      );
    } else {
      addMutate({ staffId, data }, { onSuccess, onError });
    }
  };
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Qualification" : "Add Qualification"}
    >
      <div className="flex flex-col gap-4">
        <Text scale={"content"} className="text-neutrals-700">
          DETAILS
        </Text>

        <FormProvider {...methods}>
          <form
            id="add-qualification-form"
            className="flex flex-col gap-4 mb-4"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
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
            <DatePicker name="award_date" label="Enter awarding year" />
            <Input name="grade" label="Enter grade" />
            <Input
              name="professional_registration"
              label="Enter registration number"
            />
            <DatePicker name="expiry_date" label="Enter expiry date" />{" "}
            {/**figure out how to make this work for selecting just years without months */}
          </form>
        </FormProvider>

        <div className="flex gap-6 *:flex-1">
          <Button onClick={onOpenChange} variant="secondary">
            Cancel
          </Button>
          <Button
            loading={isPending}
            type="submit"
            form="add-qualification-form"
          >
            Save
          </Button>
        </div>
      </div>
    </FormModal>
  );
}