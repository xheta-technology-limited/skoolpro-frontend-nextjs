"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Input } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Dispatch, SetStateAction } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  EditPayrollFormData,
  editPayrollSchema,
} from "@/features/user-management/staff-management/schemas/edit-payroll";
import {
  useUpdatePayroll,
} from "@/features/user-management/staff-management/api/update-payroll";
import { Payroll } from "@/features/user-management/staff-management/types/api/payroll";
import { setFormErrors } from "@/lib/helpers";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  payroll: Payroll;
}
export default function EditMode({ setEditMode, payroll }: Props) {
  const { staffId } = useParams<{ staffId: string }>();
  const { mutate, isPending } = useUpdatePayroll();

  const methods = useForm<EditPayrollFormData>({
    defaultValues: {
      salary_structure: payroll.salary_structure,
      payment_frequency: payroll.payment_frequency,
      base_salary: payroll.base_salary,
      allowances: {
        housing: payroll.allowances.housing,
        transport: payroll.allowances.transport,
      },
      deductions: {
        union: payroll.deductions.union,
      },
      bank_details: {
        bank_name: payroll.bank_details.bank_name,
        account_number: payroll.bank_details.account_number,
      },
      tax_information: {
        tin: payroll.tax_information.tin,
      },
      pension_information: {
        pfa: payroll.pension_information.pfa,
        pin: payroll.pension_information.pin,
      },
    },
    resolver: zodResolver(editPayrollSchema),
  });

  const onSubmit = (data: EditPayrollFormData) => {
    const payload: Payroll = {
      id: payroll.id,
      staff_id: payroll.staff_id,
      is_masked: payroll.is_masked,
      salary_structure: data.salary_structure ?? "",
      payment_frequency: data.payment_frequency ?? "",
      base_salary: data.base_salary ?? "",
      allowances: {
        housing: data.allowances?.housing ?? "",
        transport: data.allowances?.transport ?? "",
      },
      deductions: {
        union: data.deductions?.union ?? "",
      },
      bank_details: {
        bank_name: data.bank_details?.bank_name ?? "",
        account_number: data.bank_details?.account_number ?? "",
      },
      tax_information: {
        tin: data.tax_information?.tin ?? "",
      },
      pension_information: {
        pfa: data.pension_information?.pfa ?? "",
        pin: data.pension_information?.pin ?? "",
      },
    };

    mutate(
      { staffId, data: payload },
      {
        onSuccess: () => {
          toast.success("Payroll updated");
          setEditMode(false);
        },
        onError: (res) => setFormErrors(methods.setError, res.errors),
      }
    );
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
            loading={isPending}
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
            <Input name="allowances.housing" label="Enter housing allowance" />
            <Input
              name="allowances.transport"
              label="Enter transport allowance"
            />
            <Input name="deductions.union" label="Enter union deduction" />
            <Input name="bank_details.bank_name" label="Enter bank name" />
            <Input
              name="bank_details.account_number"
              label="Enter account number"
            />
            <Input name="tax_information.tin" label="Enter tax ID" />
            <Input name="pension_information.pfa" label="Enter PFA" />
            <Input name="pension_information.pin" label="Enter pension pin" />
          </div>
        </form>
      </FormProvider>
    </>
  );
}