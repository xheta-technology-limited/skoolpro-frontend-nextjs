"use client";

import { useState } from "react";
import { IconCircleCheck, IconChevronDown } from "@tabler/icons-react";

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
  plan: PricingPlan;
  billingCycle: "monthly" | "yearly";
  onSelectPlan: (planName: string) => void;
}

const PricingCard = ({ plan, billingCycle, onSelectPlan }: PricingCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <div className="flex h-full w-full flex-col rounded-[30px] bg-base-white lg:max-w-75 lg:min-h-152.5">
      {/* header: plan name, price, billed text, description */}
      <div className="flex flex-col gap-4 px-6 pt-8 pb-8">
        <h3 className="text-[16px] font-semibold leading-[1.2] text-neutrals-900">
          {plan.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-[40px] font-bold leading-[1.2] text-neutrals-900">
            ${price}
          </span>
          <span className="text-[12px] font-normal leading-[1.2] text-neutrals-400">
            per/month
            <br />
            billed {billingCycle}
          </span>
        </div>

        <p className="text-[14px] font-normal leading-[1.2] text-neutrals-900">
          {plan.description}
        </p>
      </div>

      {/* animated mid section: stats + module count + checklist — mobile collapsible, always shown on lg */}
      <div
        className={`grid px-6 transition-[grid-template-rows] duration-300 ease-in-out lg:grid-rows-[1fr]! ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="flex flex-col gap-3 overflow-hidden pb-12">
          {plan.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between text-[14px] leading-[1.2]"
            >
              <span className="text-neutrals-600">{stat.label}</span>
              <span className="font-semibold text-neutrals-900">{stat.value}</span>
            </div>
          ))}

          <span className="text-[14px] font-semibold leading-[1.2] text-neutrals-900">
            {plan.moduleCount} modules
          </span>

          <ul className="flex flex-col gap-3">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[14px] font-light leading-[1.2] text-neutrals-800"
              >
                <IconCircleCheck size={18} className="shrink-0 text-neutrals-400" />
                {feature}
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
          className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* button section — pinned to bottom */}
      <div className="mt-auto flex items-center px-6 pb-8">
        <button onClick={() => onSelectPlan(plan.name)} className="group flex h-11.75 w-full items-center justify-center gap-2.5 rounded-[28px] border border-primary bg-base-white px-8 py-3.5 transition-colors hover:bg-primary">
          <span className="text-[16px] font-normal leading-[1.2] text-primary transition-colors group-hover:text-base-white">
            Choose Plan
          </span>
        </button>
      </div>
    </div>
  );
};

export default PricingCard;