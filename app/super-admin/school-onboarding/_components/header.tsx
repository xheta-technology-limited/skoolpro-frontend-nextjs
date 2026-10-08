import { BackButton } from "@/components/common";
import React from "react";

interface Props {
  label: string;
  children?: React.ReactNode;
}
export default function Header({ label, children }: Props) {
  return (
    <div className="flex w-full flex-col gap-4 mb-6 sm:h-12 sm:flex-row sm:items-center sm:justify-between">
      <BackButton label={label} url="/super-admin/school-onboarding" />
      {children || null}
    </div>
  );
}
