"use client";

import { useState } from "react";
import { IconCircleCheck, IconChevronDown } from "@tabler/icons-react";
import { SchoolPlan } from "@/features/subscriptions/types/types";
import { titleCase } from "@/lib/helpers/string-to-title-case";

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  stats: { label: string; value: string }[];
  moduleCount: number;
  features: string[];
}

interface PricingCardProps {
  plan: SchoolPlan;
  isSelected: boolean;
  onSelectPlan: (planKey: string) => void;

  heightClassName?: string;

  maxVisibleModules?: number;
}

const PricingCard = ({
  plan,
  isSelected,
  onSelectPlan,
  heightClassName = "lg:min-h-152.5",
  maxVisibleModules = Infinity,
}: PricingCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleModules = plan.module_keys.slice(0, maxVisibleModules);

  return (
    <div
      className={`flex h-full w-full flex-col rounded-[30px] border-2 transition-colors lg:max-w-75 ${heightClassName} ${
        isSelected
          ? "border-primary bg-primary-100/40"
          : "border-transparent bg-base-white"
      }`}
    >
      {/* header: plan name, description */}
      <div className="flex flex-col gap-4 px-6 pt-8 pb-8">
        <h3 className="text-[16px] font-semibold leading-[1.2] text-neutrals-900">
          {plan.name}
        </h3>

        <p className="text-[14px] font-normal leading-[1.2] text-neutrals-900">
          {plan.description}
        </p>
      </div>

      {/* animated mid section: stats + module count + checklist*/}
      <div
        className={`grid px-6 transition-[grid-template-rows] duration-300 ease-in-out lg:grid-rows-[1fr]! ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="flex flex-col gap-3 overflow-hidden pb-12">
          <div className="flex items-center justify-between text-[14px] leading-[1.2]">
            <span className="text-neutrals-600">Student</span>
            <span className="font-semibold text-neutrals-900">
              {plan.limits.max_students}
            </span>
          </div>
          <div className="flex items-center justify-between text-[14px] leading-[1.2]">
            <span className="text-neutrals-600">Staff</span>
            <span className="font-semibold text-neutrals-900">
              {plan.limits.max_staff}
            </span>
          </div>

          <div className="flex items-center justify-between text-[14px] leading-[1.2]">
            <span className="text-neutrals-600">Campuses</span>
            <span className="font-semibold text-neutrals-900">
              {plan.limits.max_campuses}
            </span>
          </div>

          <div className="flex items-center justify-between text-[14px] leading-[1.2]">
            <span className="text-neutrals-600">Storage</span>
            <span className="font-semibold text-neutrals-900">
              {plan.limits.max_storage_mb / 1000} GB
            </span>
          </div>

          <span className="text-[14px] font-semibold leading-[1.2] text-neutrals-900">
            {plan.module_keys.length} modules
          </span>

          <ul className="flex flex-col gap-3">
            {visibleModules.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[14px] font-light leading-[1.2] text-neutrals-800"
              >
                <IconCircleCheck
                  size={18}
                  className="shrink-0 text-neutrals-400"
                />
                {titleCase(feature)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* expand/collapse toggle, mobile only */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-center gap-1 px-6 pb-6 text-sm font-medium text-primary lg:hidden"
      >
        {isExpanded ? "Show less" : "See all features"}
        <IconChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* button section — pinned to bottom */}
      <div className="mt-auto flex items-center px-6 pb-8">
        <button
          onClick={() => onSelectPlan(plan.key)}
          disabled={isSelected}
          className="group flex h-11.75 w-full items-center justify-center gap-2.5 rounded-[28px] border border-primary bg-base-white px-8 py-3.5 transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-100 disabled:hover:bg-primary-100"
        >
          <span className="text-[16px] font-normal leading-[1.2] text-primary transition-colors group-hover:text-base-white group-disabled:text-primary-400 group-disabled:group-hover:text-primary-400">
            {isSelected ? "Selected" : "Choose Plan"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PricingCard;