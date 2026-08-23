"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowCircleDown } from "iconsax-reactjs";
import { cn } from "@/lib/utils";
import {
  dashboardNavigation,
  type DashboardNavigationItem,
} from "@/config/super-admin-navigation"; // adjust to wherever this file actually lives
import { getNavIcon } from "./utils";
import Image from "next/image";
import { AdmiralBlue11 } from "@/components/icons/logos";
import { Text } from "@/components/ui";

type DashboardSidebarProps = {
  items?: DashboardNavigationItem[];
  /** Called when the user clicks the "Logout" entry (href === "") */
  onLogout?: () => void;
  className?: string;
};

export default function Sidebar({
  items = dashboardNavigation,
  onLogout,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn("flex h-screen py-8 w-72 flex-col bg-white", className)}
    >
      {/* Logo */}
      <AdmiralBlue11 height={51} width={199} />

      <div className="h-6" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pl-4 pb-6  scrollbar-none [&::-webkit-scrollbar]:hidden">
        <ul className="flex flex-col gap-8">
          {items.map((item) => (
            <NavItem
              key={item.href || item.label}
              item={item}
              pathname={pathname}
              onLogout={onLogout}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function NavItem({
  item,
  pathname,
  onLogout,
  depth = 0,
}: {
  item: DashboardNavigationItem;
  pathname: string;
  onLogout?: () => void;
  depth?: number;
}) {
  const Icon = getNavIcon(item.icon, item.href);
  const isLogout = item.href === "";

  const isActive =
    !isLogout &&
    (pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")));

  const rowClasses = cn(
    "relative flex w-full items-center text-foreground gap-3 px-4 py-3 transition-all",
    depth > 0 && "pl-10",
    isActive
      ? [
          "bg-primary-bg relative text-primary rounded-bl-ml rounded-tl-ml shadow-[-3px_0px_0px_0px_var(--color-primary)]",

          "before:content-['']",
          "before:absolute",
          "before:bg-transparent",
          "before:bottom-full",
          "before:right-0",
          "before:h-8.75",
          "before:w-8",
          "before:rounded-br-[18px]",
          "before:shadow-[0_20px_0_0_#f5f5ff]",

          "after:content-['']",
          "after:absolute",
          "after:bg-transparent",
          "after:top-full",
          "after:right-0",
          "after:h-8.75",
          "after:w-8.75",
          "after:rounded-tr-[18px]",
          "after:shadow-[20px_0_0_0_#f5f5ff]",
        ]
      : "hover:bg-muted"
  );

  if (isLogout) {
    return (
      <li>
        <button type="button" onClick={onLogout} className={rowClasses}>
          <Icon className="h-6 w-6 shrink-0" />
          <span className="truncate">{item.label}</span>
        </button>
      </li>
    );
  }

  // Plain link
  return (
    <li>
      <Link href={item.href} className={rowClasses}>
        <Icon className="shrink-0" />
        <Text
          className="truncate"
          weight={isActive ? "accent" : "standard"}
          scale={"caption"}
        >
          {item.label}
        </Text>
      </Link>
    </li>
  );
}
