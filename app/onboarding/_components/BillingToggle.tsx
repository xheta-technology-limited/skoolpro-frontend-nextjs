"use client";

interface BillingToggleProps {
  billingCycle: "monthly" | "yearly";
  onChange: (cycle: "monthly" | "yearly") => void;
}

const BillingToggle = ({ billingCycle, onChange }: BillingToggleProps) => {
  return (
    <div className="flex w-65 items-center gap-2 rounded-full bg-primary-100 p-1 lg:w-79">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`flex h-8 w-31 items-center justify-center gap-1 rounded-full p-2 transition-colors lg:h-9.75 lg:w-37.5 lg:p-2.5 ${
          billingCycle === "monthly" ? "bg-primary-1000" : ""
        }`}
      >
        <span
          className={`text-[13px] leading-[1.2] lg:text-[16px] ${
            billingCycle === "monthly"
              ? "font-semibold text-base-white"
              : "font-normal text-neutrals-800"
          }`}
        >
          Monthly
        </span>
      </button>

      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={`flex h-8 w-31 items-center justify-center gap-1 rounded-full p-2 transition-colors lg:h-9.75 lg:w-37.5 lg:p-2.5 ${
          billingCycle === "yearly" ? "bg-primary-1000" : ""
        }`}
      >
        <span
          className={`text-[13px] leading-[1.2] lg:text-[16px] ${
            billingCycle === "yearly"
              ? "font-semibold text-base-white"
              : "font-normal text-neutrals-800"
          }`}
        >
          Yearly
        </span>
        <span
          className={`text-[10px] font-normal leading-[1.2] lg:text-[12px] ${
            billingCycle === "yearly" ? "text-base-white" : "text-neutrals-800"
          }`}
        >
          -20% off
        </span>
      </button>
    </div>
  );
};

export default BillingToggle;