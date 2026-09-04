interface DetailFieldProps {
  label: string;
  value: string;
}

const DetailField = ({ label, value }: DetailFieldProps) => (
  <div className="flex min-h-[55px] overflow-hidden flex-1 flex-col gap-2 rounded-[8px] border border-grays-borders bg-white p-2">
    <span className="text-[12px] font-normal leading-[1.2] text-neutrals-700">
      {label}
    </span>
    <span className="text-[14px] font-normal truncate leading-[1.2] text-neutrals-900">
      {value}
    </span>
  </div>
);
export default DetailField;