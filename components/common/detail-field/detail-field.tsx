interface DetailFieldProps {
  label: string;
  value?: string;
  editable?: boolean;
  onChange?: (value: string) => void;
}

const DetailField = ({
  label,
  value,
  editable = false,
  onChange,
}: DetailFieldProps) => (
  <div className="flex min-h-13.75 flex-1 flex-col gap-2 overflow-hidden rounded-[8px] border border-grays-borders bg-white p-2">
    <span className="text-[12px] font-normal leading-[1.2] text-neutrals-700">
      {label}
    </span>

    {editable ? (
      <input
        type="text"
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full truncate bg-transparent text-[14px] font-normal leading-[1.2] text-neutrals-900 outline-none"
      />
    ) : (
      <span className="truncate text-[14px] font-normal leading-[1.2] text-neutrals-900">
        {value || "-"}
      </span>
    )}
  </div>
);

export default DetailField;
