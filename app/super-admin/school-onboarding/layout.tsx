import TabsNav from "../../../components/common/tabs/tabs-nav";
import { OpenModalButton } from "./academic-year/_components/create-academic-year";

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
  return (
    <div className="min-h-screen w-full">
      <div className="flex w-full flex-col gap-4 sm:h-12 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-neutrals-900">
          School onboarding
        </h1>

        <OpenModalButton />
      </div>

      <TabsNav tabs={SCHOOL_ONBOARDING_TABS} className="mt-6" />

      <div className="mb-8 w-full rounded-2xl border border-grays-borders bg-white">
        {children}
      </div>
    </div>
  );
}
