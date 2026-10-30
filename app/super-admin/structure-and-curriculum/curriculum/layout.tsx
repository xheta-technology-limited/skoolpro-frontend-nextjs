import TabsNav from "@/components/common/tabs/tabs-nav";
import { ReactNode, Suspense } from "react";

const TABS = [
  {
    label: "Subjects",
    href: "/super-admin/structure-and-curriculum/curriculum?tab=subjects",
  },
  {
    label: "Subject assignment",
    href: "/super-admin/structure-and-curriculum/curriculum?tab=subject-assignments",
  },
  {
    label: "Class subjects",
    href: "/super-admin/structure-and-curriculum/curriculum?tab=class-subjects",
  },
];

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <Suspense>
        <TabsNav tabs={TABS} hasQueryParams />

        {children}
      </Suspense>
    </div>
  );
}
