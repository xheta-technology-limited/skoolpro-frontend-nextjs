import { Button } from "@/components/ui/custom-button";
import { AddSquare } from "iconsax-reactjs";
import TabsNav from "../../../components/common/tabs/tabs-nav";

const SCHOOL_ONBOARDING_TABS = [
  {
    label: "School record",
    href: "/super-admin/school-onboarding/school-record",
  },
  {
    label: "Academic year",
    href: "/super-admin/school-onboarding/academic-year",
  },
  { label: "Timetable", href: "/super-admin/school-onboarding/timetable" },
];

export default function SchoolOnboardingLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: { open?: string; step?: string };
}) {
  const isModalOpen = searchParams.open === "true";

  const isFirstModalOpen = isModalOpen && searchParams.step === "1";

  return (
    <div className="min-h-screen w-full">
      <div className="flex w-full flex-col gap-4 sm:h-12 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-neutrals-900">
          School onboarding
        </h1>

        <Button
          size="lg"
          className="h-12 w-full gap-2 rounded-[28px] px-8 py-3.5 sm:w-auto sm:min-w-68.5"
        >
          <AddSquare variant="Bulk" size={20} />
          <span>Create Academic Year</span>
        </Button>
      </div>

      <TabsNav tabs={SCHOOL_ONBOARDING_TABS} className="mt-6" />

      <div className="mb-8 w-full min-h-[calc(100vh-14rem)] rounded-2xl border border-grays-borders bg-white">
        {children}
      </div>
    </div>
  );
}
