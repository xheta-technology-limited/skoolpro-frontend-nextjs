"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
}
export default function EditMode({ setEditMode }: Props) {
  const methods = useForm({});
  const onSubmit = () => {
    alert("Saved successfully");
    setEditMode(false);
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <Text className="text-neutrals-700">PAYROLL</Text>

        <div className="flex items-center gap-2">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            form="edit-user-form"
          >
            Save
          </Button>
        </div>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
          id="edit-user-form"
        >
          <div className="rounded-ml bg-white gap-4 p-2 grid grid-cols-2 content-start">
            <Input name="salary_structure" label="Enter salary structure" />
            <Input name="payment_frequency" label="Enter payment frequency" />
            <Input name="base_salary" label="Enter base salary" />
            <Input
              name="allowances.housing_allowance"
              label="Enter housing allowance"
            />
            <Input
              name="allowances.transport_allowance"
              label="Enter transport allowance"
            />
            <Input
              name="deductions.union_deduction"
              label="Enter union deduction"
            />
            <Input name="bank_details.bank_name" label="Enter bank name" />
            <Input
              name="bank_details.account_number"
              label="Enter account number"
            />
            <Input name="tax_information.tax_id" label="Enter tax ID" />
            <Input
              name="pension_information.pension_id"
              label="Enter pension ID"
            />
          </div>
        </form>
      </FormProvider>
    </>
  );
}
