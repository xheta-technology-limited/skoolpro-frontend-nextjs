import TabsNav from "@/components/common/tabs/tabs-nav";
import Header from "./_components/header/header";
import { ReactNode, Suspense } from "react";
import CloneRole from "./_components/modals/clone-role";
import { AddRole } from "./_components/modals";

const TABS = [
  {
    label: "Roles",
    href: "/super-admin/user-management/role-management/roles",
  },
  {
    label: "Role Editor",
    href: "/super-admin/user-management/role-management/role-editor",
  },
  {
    label: "Permission catalog",
    href: "/super-admin/user-management/role-management/permission-catalog",
  },
  {
    label: "Restriction",
    href: "/super-admin/user-management/role-management/restriction",
  },
];
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Suspense>
        <CloneRole />
        <AddRole />
        <TabsNav tabs={TABS} />
        <div className="h-1" />
        {children}
      </Suspense>
    </>
  );
}
