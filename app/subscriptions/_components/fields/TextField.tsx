"use client";

import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextFieldProps {
  placeholder: string;
  register: UseFormRegisterReturn;
  type?: string;
  value: string;
}

const TextField = ({ placeholder, register, type = "text", value }: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;

  return (
    <div className="relative">
      <label
        className={`pointer-events-none absolute left-5 transition-all duration-150 ${
          isFloating
            ? "top-2 text-xs text-neutrals-500"
            : "top-1/2 -translate-y-1/2 text-[16px] text-neutrals-400"
        }`}
      >
        {placeholder}
      </label>
      <input
        type={type}
        {...register}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`h-14 w-full rounded-2xl border border-transparent bg-[#F5F5FF] px-5 text-[16px] font-normal leading-[1.2] text-neutrals-900 focus:border-primary-500 focus:bg-white focus:outline-none ${
          isFloating ? "pt-5 pb-1" : "py-4"
        }`}
      />
    </div>
  );
};

export default TextField;