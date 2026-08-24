"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  dashboardNavigation,
  type DashboardNavigationItem,
} from "@/config/super-admin-navigation"; // adjust to wherever this file actually lives
import Image from "next/image";
import { AdmiralBlue11 } from "@/components/icons/logos";
import { Text } from "@/components/ui";
import { useLogout } from "@/features/auth/api/logout";

type DashboardSidebarProps = {
  items?: DashboardNavigationItem[];
  className?: string;
};

export default function Sidebar({
  items = dashboardNavigation,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  return (
    <aside
      className={cn(
        "flex h-screen py-4 md:py-8 w-16 md:w-72 flex-col bg-white",
        className
      )}
    >
      {/* Logo */}
      <div className="hidden md:flex justify-start">
        <AdmiralBlue11 height={51} width={199} />
      </div>

      <div className="flex md:hidden justify-center">
        <Image
          alt="skoolpro_logo"
          width={100}
          height={25}
          src={"/icons/SkoolPro_Mignight_Blue_2_1.png"}
        />
      </div>

      <div className="h-6" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pl-1 md:pl-4 pb-6  scrollbar-none [&::-webkit-scrollbar]:hidden">
        <ul className="flex flex-col gap-8">
          {items.map((item) => (
            <NavItem
              key={item.href || item.label}
              item={item}
              pathname={pathname}
              onLogout={() => logout()}
              isLoggingOut={isLoggingOut}
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
  isLoggingOut,
  depth = 0,
}: {
  item: DashboardNavigationItem;
  pathname: string;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  depth?: number;
}) {
  const Icon = item.icon;
  const isLogout = item.href === "";

  const isActive = !isLogout && pathname.includes(item.href);

  const rowClasses = cn(
    "relative flex w-full items-center justify-center md:justify-start text-foreground gap-3 px-4 py-3 transition-all",
    depth > 0 && "pl-5 md:pl-10",
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
          "md:before:shadow-[0_20px_0_0_#f5f5ff]",
          "before:shadow-[0_10px_0_0_#f5f5ff]",

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
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className={cn(rowClasses, isLoggingOut && "opacity-60")}
        >
          {Icon && (
            <Icon variant="Bulk" size={24} className="h-6 w-6 shrink-0" />
          )}
          <span className="sr-only truncate md:not-sr-only">{item.label}</span>
        </button>
      </li>
    );
  }

  // Plain link
  return (
    <li>
      <Link href={item.href} className={rowClasses}>
        {Icon && <Icon variant="Bulk" size={24} className="shrink-0" />}
        <Text
          className="truncate hidden md:inline"
          weight={isActive ? "accent" : "standard"}
          scale={"caption"}
        >
          {item.label}
        </Text>
      </Link>
    </li>
  );
}
