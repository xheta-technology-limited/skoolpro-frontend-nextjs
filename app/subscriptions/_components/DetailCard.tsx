import { Edit } from "iconsax-react";
import DetailField from "./DetailField";

interface DetailCardProps {
  title: string;
  fields: { label: string; value: string }[];
  onEdit: () => void;
}

const DetailCard = ({ title, fields, onEdit }: DetailCardProps) => {
  const rows: [typeof fields[0], typeof fields[0] | undefined][] = [];
  for (let i = 0; i < fields.length; i += 2) {
    rows.push([fields[i], fields[i + 1]]);
  }

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-2xl border border-[#F0EBFB] bg-white pb-8">
      <div className="flex items-center justify-between rounded-t-2xl border border-primary-100 bg-[#F5F5FF] px-8 py-4">
        <span className="font-[Inter] text-[16px] font-normal leading-6 text-[#645D72]">
            {title}
        </span>
        <button
            onClick={onEdit}
            className="flex h-8.25 w-24.5 items-center justify-center gap-2 rounded-[28px] bg-white px-6 py-2"
            >
            <Edit size={16} variant="Bulk" color="#010081" />
            <span className="text-[14px] font-normal leading-[1.2] text-primary">
                Edit
            </span>
        </button>
      </div>

      <div className="mx-8 flex flex-col gap-4 rounded-2xl bg-[#F5F5FF] p-2">
        {rows.map(([left, right], index) => (
          <div key={index} className="flex gap-2">
            <DetailField label={left.label} value={left.value} />
            {right && <DetailField label={right.label} value={right.value} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailCard;