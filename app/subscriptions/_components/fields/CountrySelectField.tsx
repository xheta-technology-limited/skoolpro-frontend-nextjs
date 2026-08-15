"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { UseFormRegisterReturn, UseFormSetValue } from "react-hook-form";
import countryCodesList from "country-codes-list";
import { IconSearch } from "@tabler/icons-react";
import { ArrowSquareDown } from "iconsax-react";
import { SchoolProfileFormValues } from "../SchoolProfileStep";

function flagEmoji(isoCode: string) {
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

interface Country {
  code: string;
  name: string;
}

const allCountries: Country[] = Object.entries(
  countryCodesList.customList("countryCode", "{countryNameEn}")
).map(([code, name]) => ({ code, name: name as string }));

interface CountrySelectFieldProps {
  placeholder: string;
  fieldName: keyof SchoolProfileFormValues;
  register: UseFormRegisterReturn;
  value: string;
  setValue: UseFormSetValue<SchoolProfileFormValues>;
}

const CountrySelectField = ({
  placeholder,
  fieldName,
  register,
  value,
  setValue,
}: CountrySelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = allCountries.find((c) => c.name === value);
  const isFloating = isOpen || Boolean(value);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allCountries.filter((c) => c.name.toLowerCase().includes(q));
  }, [search]);

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
        className={`flex h-14 w-full items-center justify-between rounded-2xl border border-transparent bg-[#F5F5FF] px-5 text-left text-[16px] font-normal leading-[1.2] text-neutrals-900 focus:border-primary-500 focus:bg-white focus:outline-none ${
          isFloating ? "pt-5 pb-1" : "py-4"
        }`}
      >
        <span>{selected ? `${flagEmoji(selected.code)} ${selected.name}` : ""}</span>
        <ArrowSquareDown 
              size={24} 
              variant="Bulk" 
              color="#433E3F"
              className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-20 mt-2 max-h-80 w-full overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-primary-100 px-4 py-3">
            <IconSearch size={16} className="text-neutrals-500" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for countries"
              className="w-full text-sm outline-none"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-4 py-4 text-sm text-neutrals-500">No countries found</div>
            )}
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setValue(fieldName, c.name);
                  setIsOpen(false);
                  setSearch("");
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-neutrals-100"
              >
                <span>{flagEmoji(c.code)}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelectField;