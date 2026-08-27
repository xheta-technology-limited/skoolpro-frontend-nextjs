"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface TabItem {
  label: string;
  href: string;
}

interface TabsNavProps {
  tabs: TabItem[];
  className?: string;
}

export default function TabsNav({ tabs, className }: TabsNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-10.25 gap-2", className)}>
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
                "flex h-10.25 items-center gap-1.5 rounded-tl-[8px] rounded-tr-ml bg-white px-4 py-3 text-sm font-medium",              isActive
                ? "border-b-2 border-secondary text-primary shadow-[0px_1px_24px_8px_#14141414]"
                : "text-neutrals-500"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}