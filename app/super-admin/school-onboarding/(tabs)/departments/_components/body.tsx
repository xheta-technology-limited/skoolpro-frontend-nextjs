"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { More } from "iconsax-reactjs";
import clsx from "clsx";
import { toast } from "sonner";

import { Pagination } from "@/components/common";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import SearchInput from "@/components/ui/form/input/search-input";
import { useListDepartments } from "@/features/departments/api/list-departments";
import { useActivateDepartment } from "@/features/departments/api/activate-department";
import { useDeactivateDepartment } from "@/features/departments/api/deactivate-department";
import { useListStaffPicker } from "@/features/user-management/staff-management/api/list-staff-picker";
import { Department } from "@/types";
import DeleteDepartmentModal from "./modals/DeleteDepartmentModal";
import ReassignDepartmentModal from "./modals/ReassignDepartmentModal";

type DepartmentStatus = "active" | "deactivated";
type StatusFilter = "all" | DepartmentStatus;

// The design labels the third tab "Retired" but shows "Deactivated" on
// the rows themselves, so the tab maps to `is_active: false`.
const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "deactivated", label: "Retired" },
];

const COLUMNS = ["Department", "Head", "Subjects", "Staff", "Status", "Action"];

// Department gets 3 shares, the four data columns 1 each, Action a bit
// less — measured off the design. Shared by the header and every row so
// they can't drift apart.
const GRID_TEMPLATE = "grid-cols-[3fr_1fr_1fr_1fr_1fr_.8fr]";

function parseFilter(value: string | null): StatusFilter {
  return value === "active" || value === "deactivated" ? value : "all";
}

function statusToActive(status: StatusFilter): boolean | undefined {
  if (status === "active") return true;
  if (status === "deactivated") return false;
  return undefined;
}

function StatusTabs({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter departments by status"
      className="flex shrink-0 items-center gap-2"
    >
      {FILTERS.map((filter) => {
        const isActive = value === filter.value;

        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.value)}
            className={clsx(
              "h-8 cursor-pointer rounded-md px-6 text-[14px] transition-colors",
              isActive
                ? "bg-primary-1000 text-white"
                : "text-neutrals-700 hover:bg-primary-bg"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

// The "…" menu. Its panel is position: fixed (placed from the button's
// bounding box when opened) so the table's overflow-x-auto wrapper can't
// clip it on the last rows. It flips above the trigger when there isn't
// room below. It closes on outside click, scroll and resize, since a
// fixed panel wouldn't follow the row.
//
// The design doesn't show what's in this menu — the four actions are
// View details, Deactivate/Reactivate, Reassign member and Delete.
function RowMenu({
  department,
  onView,
  onToggleActive,
  onReassign,
  onDelete,
}: {
  department: Department;
  onView: () => void;
  onToggleActive: () => void;
  onReassign: () => void;
  onDelete: () => void;
}) {
  const [position, setPosition] = useState<{
    top?: number;
    bottom?: number;
    right: number;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isOpen = position !== null;

  useEffect(() => {
    if (!isOpen) return;

    const close = () => setPosition(null);
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  function handleToggleMenu(event: React.MouseEvent<HTMLButtonElement>) {
    if (isOpen) {
      setPosition(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const right = window.innerWidth - rect.right;

    // Open above the trigger when there isn't room for the panel below
    // (e.g. the last row), and above only has more room than below.
    const MENU_HEIGHT = 168; // four items plus the panel padding
    const GAP = 4;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openAbove = spaceBelow < MENU_HEIGHT + GAP && spaceAbove > spaceBelow;

    setPosition(
      openAbove
        ? { bottom: window.innerHeight - rect.top + GAP, right }
        : { top: rect.bottom + GAP, right }
    );
  }

  return (
    <div ref={wrapperRef}>
      <button
        type="button"
        onClick={handleToggleMenu}
        aria-label={`More actions for ${department.name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex size-5 cursor-pointer items-center justify-center rounded-full text-neutrals-700 transition-colors hover:bg-primary-bg"
      >
        <More size={20} variant="Linear" color="currentColor" />
      </button>

      {position && (
        <div
          role="menu"
          style={{
            top: position.top,
            bottom: position.bottom,
            right: position.right,
          }}
          className="fixed z-50 w-48 overflow-hidden rounded-xl border border-primary-100 bg-[#FFFFFF] py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPosition(null);
              onView();
            }}
            className="flex w-full items-center px-4 py-2 text-left text-[13px] text-neutrals-900 hover:bg-primary-bg"
          >
            View details
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPosition(null);
              onToggleActive();
            }}
            className="flex w-full items-center px-4 py-2 text-left text-[13px] text-neutrals-900 hover:bg-primary-bg"
          >
            {department.is_active ? "Deactivate" : "Reactivate"}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPosition(null);
              onReassign();
            }}
            className="flex w-full items-center px-4 py-2 text-left text-[13px] text-neutrals-900 hover:bg-primary-bg"
          >
            Reassign member
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setPosition(null);
              onDelete();
            }}
            className="flex w-full items-center px-4 py-2 text-left text-[13px] text-[#D92D20] hover:bg-primary-bg"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function DepartmentRow({
  department,
  headName,
  isLast,
  onOpen,
  onEdit,
  onToggleActive,
  onReassign,
  onDelete,
}: {
  department: Department;
  headName: string | null;
  isLast: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onToggleActive: () => void;
  onReassign: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      role="row"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className={clsx(
        "grid min-h-14.5 cursor-pointer items-center bg-[#FFFFFF] px-3 py-2 transition-colors hover:bg-primary-bg/40",
        GRID_TEMPLATE,
        isLast ? "rounded-b-2xl" : "border-b border-primary-100"
      )}
    >
      <div role="cell" className="flex min-w-0 flex-col gap-0.5 pr-4">
        <span className="truncate text-[14px] leading-[1.3] text-neutrals-900">
          {department.name}
        </span>
        <span className="truncate text-[12px] leading-[1.3] text-neutrals-700">
          {department.description}
        </span>
      </div>

      <span role="cell" className="min-w-0 truncate pr-4 text-[14px] text-neutrals-900">
        {headName ?? "-"}
      </span>

      <span role="cell" className="text-[14px] text-neutrals-900">
        {department.subjects_count}
      </span>

      <span role="cell" className="text-[14px] text-neutrals-900">
        {department.staff_count}
      </span>

      <span
        role="cell"
        className={clsx(
          "text-[14px]",
          department.is_active ? "text-success-200" : "text-neutrals-700"
        )}
      >
        {department.is_active ? "Active" : "Deactivated"}
      </span>

      <div
        role="cell"
        className="flex items-center gap-3"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${department.name}`}
          className="h-6.5 cursor-pointer rounded-full border border-neutrals-100 px-2 text-[11px] text-neutrals-700 transition-colors hover:bg-primary-bg"
        >
          Edit
        </button>

        <RowMenu
          department={department}
          onView={onOpen}
          onToggleActive={onToggleActive}
          onReassign={onReassign}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

export default function Body() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = parseFilter(searchParams.get("status"));
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [searchKey, setSearchKey] = useState(searchParams.get("q") ?? "");
  const [currentPage, setCurrentPage] = useState(1);
  const [reassignTarget, setReassignTarget] = useState<Department>();
  const [deleteTarget, setDeleteTarget] = useState<Department>();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data,
    isPending,
    isRefetching,
    error,
    refetch,
  } = useListDepartments({
    search: searchKey || undefined,
    active: statusToActive(status),
    page: currentPage,
  });

  const departments = data?.data ?? [];
  const meta = data?.meta;

  const { data: staffPicker } = useListStaffPicker();

  const headNames = useMemo(() => {
    const names = new Map<string, string>();
    (staffPicker ?? []).forEach((staff) => {
      names.set(staff.id, `${staff.first_name} ${staff.last_name}`.trim());
    });
    return names;
  }, [staffPicker]);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  // Keep filter + search in the URL so the view survives refresh and sharing.
  function updateUrl(next: { status?: StatusFilter; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextStatus = next.status ?? status;
    const nextQuery = next.q ?? search;

    if (nextStatus === "all") params.delete("status");
    else params.set("status", nextStatus);

    if (nextQuery) params.set("q", nextQuery);
    else params.delete("q");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function handleSearch(value: string) {
    setSearch(value);
    updateUrl({ q: value });

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setSearchKey(value.trim());
      setCurrentPage(1);
    }, 300);
  }

  function handleStatusChange(nextStatus: StatusFilter) {
    updateUrl({ status: nextStatus });
    setCurrentPage(1);
  }

  function openDepartment(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("edit-department");
    params.set("view-department", id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function openEdit(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("view-department");
    params.set("edit-department", id);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const { mutate: activate } = useActivateDepartment();
  const { mutate: deactivate } = useDeactivateDepartment();

  function handleToggleActive(department: Department) {
    if (department.is_active) {
      deactivate(department.id, {
        onSuccess: () => toast.success("Department deactivated"),
      });
    } else {
      activate(department.id, {
        onSuccess: () => toast.success("Department activated"),
      });
    }
  }

  return (
    <div className="mb-8 flex w-full flex-col gap-6 rounded-2xl bg-[#FFFFFF] p-4 sm:p-6">
      {/* Inset a little further than the table frame, as in the design. */}
      <div className="flex flex-col gap-4 sm:px-4 sm:pt-4 lg:flex-row lg:items-center lg:gap-6">
        <SearchInput
          value={search}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search name or code…"
          aria-label="Search departments by name or code"
          className="flex-1"
        />

        <StatusTabs value={status} onChange={handleStatusChange} />
      </div>

      {error ? (
        <div className="flex flex-col items-center">
          <NoData
            variant="signal"
            title="Something went wrong"
            subTitle={error.message || ""}
            className="h-100 w-97.5"
          />
          <Button
            className="mt-3 w-full"
            loading={isRefetching}
            onClick={() => refetch()}
            size="lg"
          >
            Retry
          </Button>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto">
            {/* Same frame as RecordTableSection: lavender container, white
                header bar and white rows. */}
            <div
              role="table"
              aria-label="Departments"
              className="min-w-190 rounded-2xl border border-primary-100 bg-primary-bg p-2"
            >
              <div
                role="row"
                className={clsx(
                  "grid h-8.5 items-center rounded-t-2xl border border-grays-borders bg-[#FFFFFF] px-3",
                  GRID_TEMPLATE
                )}
              >
                {COLUMNS.map((column) => (
                  <span
                    key={column}
                    role="columnheader"
                    className="min-w-0 truncate text-[12px] font-semibold leading-[1.2] text-neutrals-700"
                  >
                    {column}
                  </span>
                ))}
              </div>

              <div className="mt-1">
                {isPending ? (
                  <div className="flex h-40 items-center justify-center rounded-b-2xl bg-[#FFFFFF]">
                    <Spinner size={48} />
                  </div>
                ) : departments.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-b-2xl bg-[#FFFFFF] px-4 text-center text-[14px] text-neutrals-700">
                    {search || status !== "all"
                      ? "No departments match your search or filter."
                      : "No departments yet. Add one or provision the defaults."}
                  </div>
                ) : (
                  departments.map((department, index) => (
                    <DepartmentRow
                      key={department.id}
                      department={department}
                      headName={
                        department.head_staff_id
                          ? headNames.get(department.head_staff_id) ?? null
                          : null
                      }
                      isLast={index === departments.length - 1}
                      onOpen={() => openDepartment(department.id)}
                      onEdit={() => openEdit(department.id)}
                      onToggleActive={() => handleToggleActive(department)}
                      onReassign={() => setReassignTarget(department)}
                      onDelete={() => setDeleteTarget(department)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {meta && meta.total > 0 && (
            <div className="overflow-hidden rounded-xl">
              <Pagination
                currentPage={meta.current_page}
                totalItems={meta.total}
                pageSize={meta.per_page}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      <ReassignDepartmentModal
        department={reassignTarget}
        onClose={() => setReassignTarget(undefined)}
      />

      <DeleteDepartmentModal
        department={deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
      />
    </div>
  );
}
