import { DetailField } from "@/components/common";
import { Edit } from "iconsax-reactjs";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { Dispatch, SetStateAction, useState } from "react";
import { EyeSlash, Eye } from "iconsax-reactjs";

const salaryDetails = {
  salary_structure: "Grade 7 / Step 3",
  payment_frequency: "Monthly",
  base_salary: "₦450,000",
  housing_allowance: "₦50,000",
  transport_allowance: "₦20,000",
  union_deduction: "₦2,000",
  bank_name: "First bank",
  account_number: "0123456789",
  tax_id: "TIN-99887766",
  pension_id: "Stanbic IBTC · PEN-123",
};

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
}
export default function ViewMode({ setEditMode }: Props) {
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
            value={visible(salaryDetails.salary_structure)}
          />
          <DetailField
            label="Payment frequency"
            value={visible(salaryDetails.payment_frequency)}
          />
          <DetailField
            label="Base salary"
            value={visible(salaryDetails.base_salary)}
          />
          <DetailField
            label="Housing allowance"
            value={visible(salaryDetails.housing_allowance)}
          />
          <DetailField
            label="Transport allowance"
            value={visible(salaryDetails.transport_allowance)}
          />
          <DetailField
            label="Union deduction"
            value={visible(salaryDetails.union_deduction)}
          />
          <DetailField label="Bank name" value={visible(salaryDetails.bank_name)} />
          <DetailField
            label="Account number"
            value={visible(salaryDetails.account_number)}
          />
          <DetailField label="Tax ID" value={visible(salaryDetails.tax_id)} />
          <DetailField
            label="Pension ID"
            value={visible(salaryDetails.pension_id)}
          />
        </div>
      </div>
    </>
  );
}
