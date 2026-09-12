import { DetailField } from "@/components/common";
import { Button } from "@/components/ui/custom-button";
import { Text } from "@/components/ui";
import { Edit } from "iconsax-reactjs";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setEditMode: Dispatch<SetStateAction<boolean>>;
}
export default function ViewMode({ setEditMode }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
      <Text className="text-neutrals-700">TEACHING PROFILE</Text>

      <Button
        onClick={() => setEditMode(true)}
        variant="secondary"
        size="sm"
        leftIcon={<Edit variant="Bulk" size={16} className="text-primary" />}
      >
        Edit
      </Button>
    </div>

    <div className="flex flex-col gap-4 mb-8">
      <div className="rounded-ml bg-primary-bg gap-4 p-2 grid grid-cols-2 content-start">
        <DetailField label="Teacher reg. number" value="TRN-00915" />
        <DetailField label="Period per week" value="24" />
        <DetailField label="Register class" value="SSS 2A (Science)" />
        <DetailField label="Skills" value="Lab practicals" />
        <DetailField
          label="Curriculum experience"
          value="WAEC, NECO, Cambridge, IGCSE"
        />
      </div>
    </div>
    </div>
  );
}
