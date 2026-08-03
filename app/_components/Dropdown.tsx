"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import countryCodesList from "country-codes-list";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";

function flagEmoji(isoCode: string) {
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

interface Country {
  code: string;
  name: string;
  callingCode: string;
}

const allCountries: Country[] = Object.entries(
  countryCodesList.customList("countryCode", "{countryNameEn}|{countryCallingCode}")
).map(([code, value]) => {
  const [name, callingCode] = value.split("|");
  return { code, name, callingCode };
});

export function CountryCodeDropdown({
  value,
  onChange,
}: {
  value: string; // ISO code, e.g. "NG"
  onChange: (code: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = allCountries.find((c) => c.code === value) ?? allCountries[0];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.callingCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
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
    <div ref={wrapperRef} className="relative flex h-12 w-21 shrink-0 items-center">
      {/* trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-12 w-full items-center bg-transparent py-3 pr-3 pl-4 text-left text-sm outline-none"
      >
        {selected.code}
      </button>
      <IconChevronDown
        size={16}
        className="pointer-events-none absolute right-3"
      />

      {/* dropdown panel */}
      {isOpen && (
        <div className="absolute top-full left-0 z-10 mt-2 max-h-80 w-72 overflow-hidden rounded-[8px] border border-[#D0D5DD] bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-[#D0D5DD] px-3 py-2">
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
              <div className="px-3 py-4 text-sm text-neutrals-500">
                No countries found
              </div>
            )}
            {filtered.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setIsOpen(false);
                  setSearch("");
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-neutrals-100"
              >
                <span className="flex items-center gap-2">
                  <span>{flagEmoji(c.code)}</span>
                  <span>{c.name}</span>
                </span>
                <span className="text-neutrals-500">+{c.callingCode}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}