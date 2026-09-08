"use client";

import {
  CaretLeftIcon,
  CaretRightIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
} from "@phosphor-icons/react";

interface PaginationProps {
  /** Current active page (1-indexed) */
  currentPage: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Number of items shown per page */
  pageSize: number;
  /** Called with the new page number when the user changes page */
  onPageChange: (page: number) => void;
  /** Optional className passthrough for the outer wrapper */
  className?: string;
}

/**
 * Builds the list of page numbers / ellipsis markers to render.
 * Mirrors the common "1 2 3 ... N" truncation pattern.
 */
function getPageItems(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  const items: (number | "ellipsis")[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) items.push(i);
    return items;
  }

  items.push(1);

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) items.push("ellipsis");

  for (let i = start; i <= end; i++) items.push(i);

  if (end < totalPages - 1) items.push("ellipsis");

  items.push(totalPages);

  return items;
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className = "",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  const pageItems = getPageItems(currentPage, totalPages);

  const goTo = (page: number) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    if (clamped !== currentPage) onPageChange(clamped);
  };

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <div
      className={`flex items-center justify-between gap-4 bg-white px-5 py-3 ${className}`}
    >
      <p className="text-sm text-gray-500 hidden lg:inline">
        Showing {rangeStart} – {rangeEnd} of {totalItems}
      </p>

      <nav className="flex items-center gap-1.5" aria-label="Pagination">
        <NavButton
          onClick={() => goTo(1)}
          disabled={isFirst}
          label="First page"
          variant="muted"
        >
          <CaretDoubleLeftIcon className="h-4 w-4" />
        </NavButton>

        <NavButton
          onClick={() => goTo(currentPage - 1)}
          disabled={isFirst}
          label="Previous page"
          variant="muted"
        >
          <CaretLeftIcon className="h-4 w-4" />
        </NavButton>

        {pageItems.map((item, idx) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => goTo(item)}
              aria-current={item === currentPage ? "page" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                item === currentPage
                  ? "bg-secondary-700 text-white shadow-sm"
                  : "text-neutrals-700 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        )}

        <NavButton
          onClick={() => goTo(currentPage + 1)}
          disabled={isLast}
          label="Next page"
          variant="accent"
        >
          <CaretRightIcon className="h-4 w-4" />
        </NavButton>

        <NavButton
          onClick={() => goTo(totalPages)}
          disabled={isLast}
          label="Last page"
          variant="accent"
        >
          <CaretDoubleRightIcon className="h-4 w-4" />
        </NavButton>
      </nav>
    </div>
  );
}

function NavButton({
  onClick,
  disabled,
  label,
  variant,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  variant: "muted" | "accent";
  children: React.ReactNode;
}) {
  const variantClasses =
    variant === "muted"
      ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
      : "bg-amber-50 text-amber-500 hover:bg-amber-100";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses}`}
    >
      {children}
    </button>
  );
}
