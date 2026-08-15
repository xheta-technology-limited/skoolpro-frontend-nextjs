"use client";

import { ToggleOnCircle, ToggleOffCircle } from "iconsax-react";

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleField = ({ label, checked, onChange }: ToggleFieldProps) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex h-14 w-full items-center justify-between rounded-2xl bg-[#F5F5FF] px-5 py-4"
    >
      <span className="text-[16px] font-normal leading-[1.2] text-neutrals-900">
        {label}
      </span>
      {checked ? (
        <ToggleOnCircle size={24} variant="Bulk" color="#010081" />
      ) : (
        <ToggleOffCircle size={24} variant="Bulk" color="#9F9C9C" />
      )}
    </button>
  );
};

export default ToggleField;