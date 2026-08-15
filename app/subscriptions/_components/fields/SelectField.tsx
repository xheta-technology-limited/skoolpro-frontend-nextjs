import { UseFormRegisterReturn } from "react-hook-form";
import { ArrowSquareDown } from "iconsax-react";

interface SelectFieldProps {
  placeholder: string;
  options: string[];
  register: UseFormRegisterReturn;
  value: string;
}

const SelectField = ({ placeholder, options, register, value }: SelectFieldProps) => {
  return (
    <div className="relative">
      <select
        {...register}
        defaultValue=""
        className={`h-14 w-full appearance-none rounded-2xl bg-[#F5F5FF] px-5 py-4 text-[16px] font-normal leading-[1.2] focus:outline-none ${
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
  );
};

export default SelectField;