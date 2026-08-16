import { UseFormRegisterReturn } from "react-hook-form";
import { ArrowSquareDown } from "iconsax-reactjs";

interface SelectFieldProps {
  placeholder: string;
  options: string[];
  register: UseFormRegisterReturn;
  value: string;
  error?: string;
}

const SelectField = ({ placeholder, options, register, value, error }: SelectFieldProps) => {
  return (
    <div className="w-full">
      <div className="relative">
        <select
          {...register}
          defaultValue=""
          className={`h-14 w-full appearance-none rounded-2xl border ${
            error ? "border-error" : "border-transparent"
          } bg-[#F5F5FF] px-5 py-4 text-[16px] font-normal leading-[1.2] focus:outline-none ${
            value ? "text-neutrals-900" : "text-neutrals-400"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-neutrals-900">
              {option}
            </option>
          ))}
        </select>
        <ArrowSquareDown
          size={24}
          variant="Bulk"
          color="#433E3F"
          className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2"
        />
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

export default SelectField;