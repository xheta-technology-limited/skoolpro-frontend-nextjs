import { Edit } from "iconsax-reactjs";
import { Button } from "@/components/ui/custom-button";
import { DetailField } from "@/components/common";

interface DetailCardProps {
  title?: string;
  fields: { label: string; value: string }[];
  onEdit?: () => void;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  headerAction?: React.ReactNode;
  editable?: boolean;
  onFieldChange?: (label: string, value: string) => void;
}

const DetailCard = ({
  title,
  fields,
  onEdit,
  buttonLabel = "Edit",
  buttonIcon = <Edit size={16} variant="Bulk" color="#010081" />,
  headerAction,
  editable = false,
  onFieldChange,
}: DetailCardProps) => {
  const rows: [(typeof fields)[0], (typeof fields)[0] | undefined][] = [];

  for (let i = 0; i < fields.length; i += 2) {
    rows.push([fields[i], fields[i + 1]]);
  }

  const showHeader = Boolean(title || headerAction || onEdit);

  return (
    <div className="flex flex-col gap-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          {title ? (
            <span className="font-poppins text-base font-normal uppercase leading-[120%] tracking-normal text-neutrals-700">
              {title}
            </span>
          ) : (
            <span />
          )}

          {headerAction ??
            (onEdit && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onEdit}
                leftIcon={buttonIcon}
              >
                {buttonLabel}
              </Button>
            ))}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-2xl bg-primary-bg p-2">
        {rows.map(([left, right], index) => (
          <div key={index} className="flex flex-col gap-2 sm:flex-row">
            <DetailField
              label={left.label}
              value={left.value}
              editable={editable}
              onChange={(value) => onFieldChange?.(left.label, value)}
            />

            {right && (
              <DetailField
                label={right.label}
                value={right.value}
                editable={editable}
                onChange={(value) => onFieldChange?.(right.label, value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailCard;
