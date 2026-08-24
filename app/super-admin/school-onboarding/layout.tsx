"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/custom-button";
import { AddSquare } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "School record", href: "/super-admin/school-onboarding/school-record" },
  { label: "Academic year", href: "/super-admin/school-onboarding/academic-year" },
  { label: "Timetable", href: "/super-admin/school-onboarding/timetable" },
];

export default function SchoolOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full">
      <div className="flex h-12 w-full items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutrals-900">School onboarding</h1>
        <Button size="lg" className="h-12 w-68.5 gap-2 rounded-[28px] px-8 py-3.5">
          <AddSquare variant="Bulk" size={20} />
          <span>
            Create Academic Year
          </span>
        </Button>
      </div>

      <div className="mt-6 flex h-10.25 gap-2">
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex h-10.25 items-center gap-1.5 rounded-tl-lg rounded-tr-2xl bg-white px-4 py-3 text-sm font-medium",
                isActive
                  ? "border-b-2 border-secondary text-primary shadow-[0px_1px_24px_8px_#14141414]"
                  : "text-neutrals-500"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="mb-8 w-full min-h-[calc(100vh-14rem)] rounded-2xl border border-[#F0EBFB] bg-white">
        {children}
      </div>
    </div>
  );
}