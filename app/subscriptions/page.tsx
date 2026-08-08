"use client";

import { useState } from "react";
import { AdmiralBlue11 } from "@/components/icons/logos";
import SubscriptionHeader from "./_components/SubscriptionHeader";
import BillingToggle from "./_components/BillingToggle";
import PricingCard, { PricingPlan } from "./_components/PricingCard";

const plans: PricingPlan[] = [
  {
    name: "Small School",
    description: "Core academic modules for small schools",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stats: [
      { label: "Students", value: "300" },
      { label: "Staff", value: "40" },
      { label: "Campuses", value: "1" },
      { label: "Storage", value: "5 GB" },
    ],
    moduleCount: 5,
    features: ["Admissions", "Attendance", "Exam", "Finance", "Communication"],
  },
  {
    name: "Medium School",
    description: "Core plus common operational modules for medium schools",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stats: [
      { label: "Students", value: "300" },
      { label: "Staff", value: "40" },
      { label: "Campuses", value: "1" },
      { label: "Storage", value: "5 GB" },
    ],
    moduleCount: 8,
    features: ["Core", "Behaviour", "Library", "Transport"],
  },
  {
    name: "Large School",
    description: "Full operational suite for large or multi-campus schools",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stats: [
      { label: "Students", value: "5000" },
      { label: "Staff", value: "600" },
      { label: "Campuses", value: "10" },
      { label: "Storage", value: "100 GB" },
    ],
    moduleCount: 12,
    features: ["All core", "Inventory", "Hostel", "Health", "HR & payroll"],
  },
  {
    name: "Enterprise",
    description: "All modules, unlimited scale, negotiated terms",
    monthlyPrice: 0,
    yearlyPrice: 0,
    stats: [
      { label: "Students", value: "Unlimited" },
      { label: "Staff", value: "Unlimited" },
      { label: "Campuses", value: "Unlimited" },
      { label: "Storage", value: "Unlimited" },
    ],
    moduleCount: 12,
    features: ["Everything in Large"],
  },
];

export default function SubscriptionsPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  function handleSelectPlan(planName: string) {
    // TODO: wire up real checkout/subscription flow
    console.log("selected plan:", planName);
  }

  return (
    <div className="mx-4 py-16 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-25">
      <div className="flex justify-center">
        <AdmiralBlue11 width={200} height={51} />
      </div>

      <div className="mt-8">
        <SubscriptionHeader />
      </div>

      <div className="sticky top-0 z-20 -mx-4 mt-8 bg-white/95 px-4 py-4 backdrop-blur-sm sm:-mx-8 sm:px-8 md:-mx-16 md:px-16 lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <div className="flex justify-center">
          <BillingToggle billingCycle={billingCycle} onChange={setBillingCycle} />
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            billingCycle={billingCycle}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>
    </div>
  );
}