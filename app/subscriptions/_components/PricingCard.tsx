"use client";

import { useState } from "react";
import { IconCircleCheck, IconChevronDown } from "@tabler/icons-react";

export interface PricingPlan {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: "monthly" | "yearly";
}

const PREVIEW_COUNT = 3;

const PricingCard = ({ plan, billingCycle }: PricingCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  const previewFeatures = plan.features.slice(0, PREVIEW_COUNT);
  const extraFeatures = plan.features.slice(PREVIEW_COUNT);

  return (
    <div className="flex w-full flex-col rounded-[30px] bg-base-white lg:max-w-75">
      {/* header */}
      <div className="flex flex-col gap-4 px-6 pt-8 pb-8">
        <h3 className="text-[16px] font-semibold leading-[1.2] text-neutrals-900">
          {plan.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[40px] font-bold leading-[1.2] text-neutrals-900">
            ${price}
          </span>
          <span className="text-[12px] font-normal leading-[1.2] text-neutrals-400">
            per editor/month
            <br />
            billed {billingCycle}
          </span>
        </div>
      </div>

      {/* always-visible preview features */}
      <ul className="flex flex-col gap-3 px-6 pb-3 lg:pb-0">
        {previewFeatures.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-[14px] font-light leading-[1.2] text-neutrals-800"
          >
            <IconCircleCheck size={18} className="shrink-0 text-neutrals-400" />
            {feature}
          </li>
        ))}
      </ul>

      {/* animated extra features mobile only, always expanded on lg */}
      <div
        className={`grid px-6 transition-[grid-template-rows] duration-300 ease-in-out lg:grid-rows-[1fr]! ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <ul className="flex flex-col gap-3 overflow-hidden pt-3">
          {extraFeatures.map((feature) => (
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

      {/* expand/collapse toggle — mobile only */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-center gap-1 px-6 pb-6 text-sm font-medium text-primary lg:hidden"
      >
        {isExpanded ? "Show less" : "Show all features"}
        <IconChevronDown
          size={16}
          className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* button section */}
      <div className="flex items-center px-6 pb-8 lg:min-h-19.75">
        <button className="group flex h-11.75 w-full items-center justify-center gap-2.5 rounded-[28px] border border-primary bg-base-white px-8 py-3.5 transition-colors hover:bg-primary">
          <span className="text-[16px] font-normal leading-[1.2] text-primary transition-colors group-hover:text-base-white">
            Choose Plan
          </span>
        </button>
      </div>
    </div>
  );
};

export default PricingCard;