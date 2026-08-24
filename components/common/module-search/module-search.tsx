"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/form";
import { Text } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { DashboardNavigationItem } from "@/config/super-admin-navigation";

const MIN_QUERY_LENGTH = 3;

type FlatItem = {
  item: DashboardNavigationItem;
  icon: DashboardNavigationItem["icon"];
  trail: string[];
};

function flattenItems(
  items: DashboardNavigationItem[],
  parentIcon: DashboardNavigationItem["icon"] = null,
  trail: string[] = []
): FlatItem[] {
  return items.flatMap((item) => {
    const entry: FlatItem = {
      item,
      icon: item.icon ?? parentIcon,
      trail,
    };
    return item.children
      ? [
          entry,
          ...flattenItems(item.children, entry.icon, [...trail, item.label]),
        ]
      : [entry];
  });
}

type ModuleSearchProps = {
  items: DashboardNavigationItem[];
  className?: string;
};

export default function ModuleSearch({ items, className }: ModuleSearchProps) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const isOpen = open && normalizedQuery.length >= MIN_QUERY_LENGTH;

  const results = React.useMemo(() => {
    if (!isOpen) return [];
    return flattenItems(items).filter(
      (flat) =>
        flat.item.href !== "" &&
        (flat.item.label.toLowerCase().includes(normalizedQuery) ||
          flat.item.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(normalizedQuery)
          ))
    );
  }, [items, isOpen, normalizedQuery]);

  React.useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn("relative", className)}
    >
      <Input
        name="module-search"
        label="Search modules"
        search
        autoComplete="off"
        value={query}
        onChange={(event: unknown) => {
          setQuery((event as React.ChangeEvent<HTMLInputElement>).target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {isOpen && (
        <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-ml border border-grays-borders bg-white p-2 shadow-lg">
          {results.length === 0 ? (
            <Text
              scale="caption"
              className="block px-ml py-2 text-neutrals-400"
            >
              No modules found
            </Text>
          ) : (
            <ul>
              {results.map(({ item, icon: Icon, trail }) => (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 rounded-ml px-ml py-2 transition-colors hover:bg-primary-bg"
                  >
                    {Icon && (
                      <Icon
                        variant="Bulk"
                        size={24}
                        className="shrink-0 text-neutrals-400"
                      />
                    )}
                    <span className="flex flex-col">
                      <Text scale="caption">{item.label}</Text>
                      {trail.length > 0 && (
                        <Text scale="footnote" className="text-neutrals-400">
                          {trail.join("/")}
                        </Text>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
