"use client";
import TabsNav from "../../../components/common/tabs/tabs-nav";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { OpenModalButton } from "./academic-year/_components/modals/create-academic-year";

const PROMOTION_ROUTE = "/super-admin/school-onboarding/promotion";

const SCHOOL_ONBOARDING_TABS = [
  {
    label: "School record",
    href: "/super-admin/school-onboarding/school-record",
  },
  {
    label: "Academic year",
    href: "/super-admin/school-onboarding/academic-year",
  },
  {
    label: "Promotion",
    href: PROMOTION_ROUTE,
  },
  { label: "Timetable", href: "/super-admin/school-onboarding/timetable" },
  {
    label: "Subscriptions",
    href: "/super-admin/school-onboarding/subscriptions",
  },
];

export default function SchoolOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPromotionRoute = pathname.startsWith(PROMOTION_ROUTE);

  return (
    <div
      className={cn(
        "w-full",
        isPromotionRoute ? "h-full overflow-hidden" : "min-h-screen"
      )}
    >
      <div className="flex w-full flex-col gap-4 sm:h-12 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-neutrals-900">
          School onboarding
        </h1>

        <OpenModalButton />
      </div>

      <TabsNav tabs={SCHOOL_ONBOARDING_TABS} className="mt-6" />

      <div
        className={cn(
          "mb-8 w-full rounded-2xl border border-grays-borders bg-white",
          isPromotionRoute && "h-full overflow-hidden"
        )}
      >
        {children}
      </div>
    </div>
  );
}