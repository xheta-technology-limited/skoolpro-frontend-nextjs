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
      className={cn(
        "flex h-screen py-8 w-72 flex-col border-r border-border bg-white",
        className
      )}
    >
      {/* Logo */}
      <AdmiralBlue11 height={51} width={199} />

      <div className="h-6" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 pb-6">
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
  const hasChildren = !!item.children?.length;
  const isLogout = item.href === "";

  const isActive =
    !isLogout &&
    !hasChildren &&
    (pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href + "/")));

  const [open, setOpen] = React.useState(
    () => hasChildren && item.children!.some((c) => pathname.startsWith(c.href))
  );

  const rowClasses = cn(
    "flex w-full items-center text-foreground gap-3 rounded-xl px-4 py-3 transition-colors",
    depth > 0 && "pl-10",
    isActive
      ? "bg-[#F5F5FF] text-primary rounded-bl-ml rounded-tl-ml shadow-[-3px_0px_0px_0px_var(--color-primary)]"
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

  if (hasChildren) {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={rowClasses}
          aria-expanded={open}
        >
          <Icon className="h-6 w-6 shrink-0" />
          <span className="flex-1 truncate text-left">{item.label}</span>
          <ArrowCircleDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
        {open && (
          <ul className="mt-1 flex flex-col gap-1">
            {item.children!.map((child) => (
              <NavItem
                key={child.href || child.label}
                item={child}
                pathname={pathname}
                onLogout={onLogout}
                depth={depth + 1}
              />
            ))}
          </ul>
        )}
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
