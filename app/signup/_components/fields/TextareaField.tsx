"use client";

import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface TextareaFieldProps {
  placeholder: string;
  register: UseFormRegisterReturn;
  value: string;
  maxLength?: number;
}

const TextareaField = ({ placeholder, register, value, maxLength = 200 }: TextareaFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;
  const textareaId = `field-${register.name}`;

  return (
    <div className="w-full">
      <div className="relative">
        <label
          htmlFor={textareaId}
          className={`pointer-events-none absolute left-5 transition-all duration-150 ${
            isFloating
              ? "top-2 text-xs text-neutrals-500"
              : "top-4 text-[16px] text-neutrals-400"
          }`}
        >
          {placeholder}
        </label>
        <textarea
          id={textareaId}
          maxLength={maxLength}
          {...register}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            register.onBlur(e);
            setIsFocused(false);
          }}
          className={`h-30 w-full resize-none rounded-[4px] border border-transparent bg-[#F5F5FF] px-5 text-[16px] font-normal leading-[1.2] text-neutrals-900 focus:border-primary-500 focus:bg-white focus:outline-none ${
            isFloating ? "pt-8 pb-1" : "py-4"
          }`}
        />
      </div>
      <p className="mt-1 text-right text-xs text-neutrals-500">
        {value.length}/{maxLength}
      </p>
    </div>
  );
};

export default TextareaField;