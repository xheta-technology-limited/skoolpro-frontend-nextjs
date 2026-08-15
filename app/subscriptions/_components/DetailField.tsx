interface DetailFieldProps {
  label: string;
  value: string;
}

const DetailField = ({ label, value }: DetailFieldProps) => (
  <div className="flex h-13.75 flex-1 flex-col gap-2 rounded-[8px] border border-[#F0EBFB] bg-white p-2">
    <span className="text-[12px] font-normal leading-[1.2] text-neutrals-700">
      {label}
    </span>
    <span className="text-[14px] font-normal leading-[1.2] text-neutrals-900">
      {value}
    </span>
  </div>
);
export default DetailField;