"use client";

import { ToggleOnCircle, ToggleOffCircle } from "iconsax-reactjs";

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleField = ({ label, checked, disabled = false, onChange }: ToggleFieldProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex h-14 w-full items-center justify-between rounded-2xl bg-[#F5F5FF] px-5 py-4 ${
        disabled ? "cursor-not-allowed opacity-70" : ""
      }`}
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