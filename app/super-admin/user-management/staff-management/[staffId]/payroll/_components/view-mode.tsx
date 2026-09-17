import { DetailField } from "@/components/common";
import { Edit } from "iconsax-reactjs";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Dispatch, SetStateAction, useState } from "react";
import { EyeSlash, Eye } from "iconsax-reactjs";
import { Payroll } from "@/features/user-management/staff-management/types/api/payroll";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
  payroll: Payroll;
}
export default function ViewMode({ setEditMode, payroll }: Props) {
  const [isShown, setShown] = useState<boolean>(false);
  const visible = (value: string) => (isShown ? value : "*****");
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Text className="text-neutrals-700">PAYROLL</Text>

        <div className="flex gap-6 items-center">
          <Button
            onClick={() => setShown((prev) => !prev)}
            variant="tertiary"
            size="sm"
            leftIcon={
              isShown ? (
                <Eye variant="Bulk" size={16} className="text-primary" />
              ) : (
                <EyeSlash variant="Bulk" size={16} className="text-primary" />
              )
            }
          >
            View
          </Button>
          <Button
            onClick={() => setEditMode(true)}
            variant="secondary"
            size="sm"
            leftIcon={
              <Edit variant="Bulk" size={16} className="text-primary" />
            }
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
          <DetailField
            label="Salary structure"
            value={visible(payroll.salary_structure)}
          />
          <DetailField
            label="Payment frequency"
            value={visible(payroll.payment_frequency)}
          />
          <DetailField label="Base salary" value={visible(payroll.base_salary)} />
          <DetailField
            label="Housing allowance"
            value={visible(payroll.allowances.housing)}
          />
          <DetailField
            label="Transport allowance"
            value={visible(payroll.allowances.transport)}
          />
          <DetailField
            label="Union deduction"
            value={visible(payroll.deductions.union)}
          />
          <DetailField
            label="Bank name"
            value={visible(payroll.bank_details.bank_name)}
          />
          <DetailField
            label="Account number"
            value={visible(payroll.bank_details.account_number)}
          />
          <DetailField
            label="Tax ID"
            value={visible(payroll.tax_information.tin)}
          />
          <DetailField
            label="Pension ID"
            value={visible(
              `${payroll.pension_information.pfa} · ${payroll.pension_information.pin}`
            )}
          />
        </div>
      </div>
    </>
  );
}