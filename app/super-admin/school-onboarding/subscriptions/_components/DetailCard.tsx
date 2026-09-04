import { Edit } from "iconsax-reactjs";
import { Button } from "@/components/ui/custom-button";
import DetailField from "./DetailField";

interface DetailCardProps {
  title: string;
  fields: { label: string; value: string }[];
  onEdit: () => void;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
}

const DetailCard = ({
  title,
  fields,
  onEdit,
  buttonLabel = "Edit",
  buttonIcon = <Edit size={16} variant="Bulk" color="#010081" />,
}: DetailCardProps) => {
  const rows: [typeof fields[0], typeof fields[0] | undefined][] = [];
  for (let i = 0; i < fields.length; i += 2) {
    rows.push([fields[i], fields[i + 1]]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm uppercase tracking-wide text-neutrals-500">
          {title}
        </span>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onEdit}
          leftIcon={buttonIcon}
        >
          {buttonLabel}
        </Button>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-primary-bg p-2">
        {rows.map(([left, right], index) => (
          <div key={index} className="flex flex-col gap-2 sm:flex-row">
            <DetailField label={left.label} value={left.value} />
            {right && <DetailField label={right.label} value={right.value} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailCard;