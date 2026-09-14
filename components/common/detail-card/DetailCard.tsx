import { Edit } from "iconsax-reactjs";
import { Button } from "@/components/ui/custom-button";
import { DetailField } from "@/components/common";

interface DetailCardProps {
  // Optional now: omit title (and/or onEdit) to render the card with
  // no header row at all — useful when a parent page already renders
  // its own heading/edit button above the card (e.g. a "Student"
  // section header that sits above the photo + this fields grid).
  title?: string;
  fields: { label: string; value: string }[];
  onEdit?: () => void;
  buttonLabel?: string;
  buttonIcon?: React.ReactNode;
  // Full override for the header's right-hand side — takes priority
  // over buttonLabel/buttonIcon/onEdit entirely when provided, so a
  // caller can render something other than a single Edit button (e.g.
  // a dropdown + button pair) without DetailCard needing to know
  // about every possible header action.
  headerAction?: React.ReactNode;
}

const DetailCard = ({
  title,
  fields,
  onEdit,
  buttonLabel = "Edit",
  buttonIcon = <Edit size={16} variant="Bulk" color="#010081" />,
  headerAction,
}: DetailCardProps) => {
  const rows: [(typeof fields)[0], (typeof fields)[0] | undefined][] = [];
  for (let i = 0; i < fields.length; i += 2) {
    rows.push([fields[i], fields[i + 1]]);
  }

  // Show the header row if there's a title to display, an explicit
  // custom action, or a default Edit button (onEdit provided).
  const showHeader = Boolean(title || headerAction || onEdit);

  return (
    <div className="flex flex-col gap-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          {title ? (
            <span className="text-sm uppercase tracking-wide text-neutrals-500">
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
            <DetailField label={left.label} value={left.value} />
            {right && <DetailField label={right.label} value={right.value} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailCard;