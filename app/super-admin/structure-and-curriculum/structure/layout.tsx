import TabsNav from "@/components/common/tabs/tabs-nav";
import { ReactNode, Suspense } from "react";

const TABS = [
  {
    label: "Education Structure",
    href: "/super-admin/structure-and-curriculum/structure?tab=education",
  },
  {
    label: "Classes Structure",
    href: "/super-admin/structure-and-curriculum/structure?tab=classes",
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
