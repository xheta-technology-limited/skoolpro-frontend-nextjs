import React, { Suspense } from "react";
import UserDetailsLayout from "../../_components/user-details-layout";

export default function Layout({
  params,
  children,
}: {
  params: Promise<{ staffId: string }>;
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <UserDetailsLayoutWrapper params={params}>
        {children}
      </UserDetailsLayoutWrapper>
    </Suspense>
  );
}

async function UserDetailsLayoutWrapper({
  params,
  children,
}: {
  params: Promise<{ staffId: string }>;
  children: React.ReactNode;
}) {
  const { staffId } = await params;

  const tabs = [
    {
      label: "General",
      href: `/super-admin/user-management/staff-management/${staffId}/general`,
    },
    {
      label: "Teaching profile",
      href: `/super-admin/user-management/staff-management/${staffId}/teaching-profile`,
    },
    {
      label: "Payroll",
      href: `/super-admin/user-management/staff-management/${staffId}/payroll`,
    },
    {
      label: "Login access",
      href: `/super-admin/user-management/staff-management/${staffId}/login-access`,
    },
  ];

  return (
    <UserDetailsLayout
      pageLabel="Staff details"
      tabs={tabs}
      backUrl="/super-admin/user-management/staff-management"
    >
      {children}
    </UserDetailsLayout>
  );
}
