import React, { Suspense } from "react";
import UserDetailsLayout from "../../_components/user-details-layout";

export default function Layout({
  params,
  children,
}: {
  params: Promise<{ studentId: string }>;
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
  params: Promise<{ studentId: string }>;
  children: React.ReactNode;
}) {
  const { studentId } = await params;

  const tabs = [
    {
      label: "General",
      href: `/super-admin/user-management/student-management/${studentId}/general`,
    },
    {
      label: "Status",
      href: `/super-admin/user-management/student-management/${studentId}/status`,
    },
    {
      label: "Reports",
      href: `/super-admin/user-management/student-management/${studentId}/reports`,
    },
    {
      label: "Billing",
      href: `/super-admin/user-management/student-management/${studentId}/billing`,
    },
    {
      label: "Enrollment",
      href: `/super-admin/user-management/student-management/${studentId}/enrollment`,
    },
  ];

  return (
    <UserDetailsLayout
      pageLabel="Student details"
      tabs={tabs}
      backUrl="/super-admin/user-management/student-management"
    >
      {children}
    </UserDetailsLayout>
  );
}
