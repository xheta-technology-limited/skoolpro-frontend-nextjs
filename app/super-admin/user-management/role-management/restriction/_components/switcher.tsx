"use client";

import { Text } from "@/components/ui";
import { useProgressRouter } from "@/features/page-loader";
import { usePathname, useSearchParams } from "next/navigation";
import { CSSProperties } from "react";

export default function Switcher() {
  const router = useProgressRouter();
  const searchParams = usePathname();
  const SWITCHES = [
    {
      label: "People",
      isActive: searchParams.includes("/restriction/people"),
      onClick: () =>
        router.push(
          "/super-admin/user-management/role-management/restriction/people"
        ),
    },
    {
      label: "Roles",
      isActive: searchParams.includes("/restriction/roles"),
      onClick: () => () =>
        router.push(
          "/super-admin/user-management/role-management/restriction/roles"
        ),
    },
  ];
  return (
    <div className="mb-8 flex gap-2 items-center flex-wrap">
      {SWITCHES.map((f) => (
        <Switch
          key={f.label}
          label={f.label}
          onClick={f.onClick}
          isActive={f.isActive}
        />
      ))}
    </div>
  );
}

const Switch = ({
  isActive,
  onClick,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
}) => {
  const activeStyle: CSSProperties = {
    color: "white",
    backgroundColor: "var(--color-primary-900)",
  };
  const styles: CSSProperties = {
    backgroundColor: "transparent",
  };
  return (
    <button
      onClick={onClick}
      style={isActive ? activeStyle : styles}
      className="px-6 py-2 rounded-sm"
    >
      <Text
        style={{ color: isActive ? "white" : "var(--color-neutrals-700)" }}
        scale={"caption"}
      >
        {label}
      </Text>
    </button>
  );
};
