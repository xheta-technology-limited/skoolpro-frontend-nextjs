"use client";

import { useState } from "react";
import { AdmiralBlue11 } from "@/components/icons/logos";
import SubscriptionHeader from "./_components/SubscriptionHeader";
import BillingToggle from "./_components/BillingToggle";
import PricingCard, { PricingPlan } from "./_components/PricingCard";

const features = [
  "Admissions", "User management", "Attendance", "Examination & Grading",
  "Finance", "Student portal", "Teacher portal", "Parent portal",
  "Human resource", "Payroll", "Library", "Inventory", "Transport",
  "Hostel", "Health record", "Communication", "Learning portal",
  "Timetable", "Analytics", "Artificial Intelligence",
];

const plans: PricingPlan[] = [
  { name: "Basic Plan", monthlyPrice: 0, yearlyPrice: 0, features },
  { name: "Starter Plan", monthlyPrice: 0, yearlyPrice: 0, features },
  { name: "Pro Plan", monthlyPrice: 0, yearlyPrice: 0, features },
  { name: "Custom Plan", monthlyPrice: 0, yearlyPrice: 0, features },
];

export default function SubscriptionsPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

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
          <PricingCard key={plan.name} plan={plan} billingCycle={billingCycle} />
        ))}
      </div>
    </div>
  );
}