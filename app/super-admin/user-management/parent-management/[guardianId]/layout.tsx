import React, { Suspense } from "react";
import UserDetailsLayout from "../../_components/user-details-layout";

export default function Layout({
  params,
  children,
}: {
  params: Promise<{ guardianId: string }>;
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
  params: Promise<{ guardianId: string }>;
  children: React.ReactNode;
}) {
  const { guardianId } = await params;

  const tabs = [
    {
      label: "General",
      href: `/super-admin/user-management/parent-management/${guardianId}/general`,
    },
    {
      label: "Billing",
      href: `/super-admin/user-management/parent-management/${guardianId}/billing`,
    },
    {
      label: "Login Access",
      href: `/super-admin/user-management/parent-management/${guardianId}/login-access`,
    },
  ];

  return (
    <UserDetailsLayout
      pageLabel="Guardian details"
      tabs={tabs}
      backUrl="/super-admin/user-management/parent-management"
    >
      {children}
    </UserDetailsLayout>
  );
}
