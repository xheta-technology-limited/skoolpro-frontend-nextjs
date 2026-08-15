"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Calendar } from "iconsax-react";
import "react-day-picker/dist/style.css";
import { SchoolProfileFormValues } from "../SchoolProfileStep";

interface DateFieldProps {
  placeholder: string;
  fieldName: keyof SchoolProfileFormValues;
  register: UseFormRegisterReturn;
  value: string;
  setValue: UseFormSetValue<SchoolProfileFormValues>;
}

const DateField = ({ placeholder, fieldName, register, value, setValue }: DateFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : undefined;
  const isFloating = isOpen || Boolean(value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <label
        className={`pointer-events-none absolute left-5 transition-all duration-150 ${
          isFloating
            ? "top-2 text-xs text-neutrals-500"
            : "top-1/2 -translate-y-1/2 text-[16px] text-neutrals-400"
        }`}
      >
        {placeholder}
      </label>

      <input type="hidden" {...register} />

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`h-14 w-full rounded-2xl border border-transparent bg-[#F5F5FF] px-5 text-left text-[16px] font-normal leading-[1.2] text-neutrals-900 focus:border-primary-500 focus:bg-white focus:outline-none ${
          isFloating ? "pt-5 pb-1" : "py-4"
        }`}
      >
        {selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""}
      </button>

      <Calendar
        size={24}
        variant="Bulk"
        color="#433E3F"
        className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2"
      />

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-2 rounded-2xl border border-primary-100 bg-white p-2 shadow-lg">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setValue(fieldName, format(date, "yyyy-MM-dd"));
                setIsOpen(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DateField;