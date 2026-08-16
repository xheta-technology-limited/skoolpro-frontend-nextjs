"use client";

import { useEffect, useRef, useState } from "react";
import { Path, UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Calendar } from "iconsax-reactjs";
import { SchoolProfileFormValues } from "@/features/auth/schemas";
import "react-day-picker/dist/style.css";

interface DateFieldProps {
  placeholder: string;
  fieldName: Path<SchoolProfileFormValues>;
  register: UseFormRegisterReturn;
  value: string;
  setValue: UseFormSetValue<SchoolProfileFormValues>;
  error?: string;
}

const DateField = ({ placeholder, fieldName, register, value, setValue, error }: DateFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const parsedDate = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const selectedDate = parsedDate && isValid(parsedDate) ? parsedDate : undefined;
  const isFloating = isOpen || Boolean(value);
  const triggerId = `field-${register.name}`;
  const panelId = `${triggerId}-panel`;

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
    <div className="w-full">
      <div ref={wrapperRef} className="relative">
        <label
          htmlFor={triggerId}
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
          id={triggerId}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? panelId : undefined}
          className={`h-14 w-full rounded-2xl border ${
            error ? "border-error" : "border-transparent"
          } bg-[#F5F5FF] px-5 text-left text-[16px] font-normal leading-[1.2] text-neutrals-900 focus:border-primary-500 focus:bg-white focus:outline-none ${
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
          <div
            id={panelId}
            role="dialog"
            aria-modal="false"
            className="absolute top-full left-0 z-20 mt-2 rounded-2xl border border-primary-100 bg-white p-2 shadow-lg"
          >
            <DayPicker
              mode="single"
              captionLayout="dropdown"
              hideNavigation
              startMonth={new Date(1950, 0)}
              endMonth={new Date(2035, 11)}
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setValue(fieldName, format(date, "yyyy-MM-dd"), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setIsOpen(false);
                }
              }}
              classNames={{
                dropdowns: "flex gap-2",
                dropdown:
                  "rounded-lg border border-primary-100 bg-[#F5F5FF] px-2 py-1 text-sm text-neutrals-900 focus:outline-none",
                caption_label: "hidden",
                month_caption: "flex items-center justify-center mb-2",
                day: "rounded-lg hover:bg-primary-100",
                selected: "bg-primary text-white rounded-lg",
                today: "font-semibold text-primary",
              }}
            />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
};

export default DateField;