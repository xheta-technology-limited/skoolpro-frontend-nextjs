"use client";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function SuperAdminProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider>{children}</SidebarProvider>
    </>
  );
}
