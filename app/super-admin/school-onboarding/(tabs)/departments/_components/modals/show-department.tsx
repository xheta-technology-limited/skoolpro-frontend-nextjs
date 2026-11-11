"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowSwapHorizontal, ArchiveSlash, Edit, Trash, User } from "iconsax-reactjs";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/animations";
import { Pagination } from "@/components/common";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useGetDepartment } from "@/features/departments/api/get-department";
import { useActivateDepartment } from "@/features/departments/api/activate-department";
import { useDeactivateDepartment } from "@/features/departments/api/deactivate-department";
import { useListSubjects } from "@/features/academic-year/api/list-subjects";
import { useListStaff } from "@/features/user-management/staff-management/api/list-staff";
import { useProgressRouter } from "@/features/page-loader";
import { titleCase } from "@/lib/helpers";
import DeleteDepartmentModal from "./DeleteDepartmentModal";
import ReassignDepartmentModal from "./ReassignDepartmentModal";

type Tab = "subjects" | "staff";

const STAFF_GRID = "grid-cols-[1.4fr_1fr_1fr]";

const ACTION_BUTTON =
  "flex h-8 items-center gap-2 rounded-[28px] border bg-base-white px-5 text-[14px] font-normal";

function CountBadge({ count, active }: { count: number; active: boolean }) {
  return (
    <span
      className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-[6px] px-1 text-[11px] font-medium leading-none text-neutrals-700 ${
        active ? "bg-[#D5D5FA]" : "bg-[#F5F5FF]"
      }`}
    >
      {count}
    </span>
  );
}

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex h-10 items-center gap-1.5 rounded-t-[8px] px-4 text-sm font-medium ${
        active
          ? "border-b-2 border-secondary bg-white text-primary shadow-[0px_1px_12px_4px_#1414140D]"
          : "text-neutrals-500"
      }`}
    >
      {label}
      <CountBadge count={count} active={active} />
    </button>
  );
}

// Lavender box with a white card inside, used for the empty states and
// the lists.
function ListBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] bg-[#F5F5FF] p-2">
      <div className="overflow-hidden rounded-[8px] border border-[#F0EBFB] bg-white">
        {children}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <ListBox>
      <div className="flex flex-col items-center gap-1 px-4 py-3">
        <ArchiveSlash size={24} variant="Bulk" color="#5a5555" />
        <span className="text-[13px] text-neutrals-700">{message}</span>
      </div>
    </ListBox>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-[16px] border border-[#E2DDF9] bg-white p-4">
      <span className="text-[24px] font-medium leading-none text-neutrals-900">
        {value}
      </span>
      <span className="text-[14px] text-neutrals-700">{label}</span>
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/**
 * Department details: head, two counts, and Subjects / Staff tabs, with
 * Edit, Reassign, Deactivate/Activate and Delete below.
 *
 * The header, head, status and stat cards come from the show endpoint.
 * The tab contents are still placeholders until the subject/staff list
 * endpoints exist. Edit (including Change/Assign head), Reassign,
 * Deactivate/Activate and Delete are all wired up.
 */
export default function DepartmentDetailModal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const departmentId = searchParams.get("view-department") ?? "";
  const isOpen = pathname.includes("/departments") && !!departmentId;

  const [tab, setTab] = useState<Tab>("subjects");
  const [reassigning, setReassigning] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [staffPage, setStaffPage] = useState(1);

  const {
    data: department,
    isPending,
    isRefetching,
    error,
    refetch,
  } = useGetDepartment(departmentId, { enabled: isOpen });

  const {
    data: subjects,
    isPending: isSubjectsPending,
    error: subjectsError,
    refetch: refetchSubjects,
  } = useListSubjects({ department: departmentId }, { enabled: isOpen });

  const {
    data: staffData,
    isPending: isStaffPending,
    error: staffError,
    refetch: refetchStaff,
  } = useListStaff(
    { department: departmentId, page: staffPage },
    { enabled: isOpen }
  );

  const { mutate: deactivate, isPending: isDeactivating } =
    useDeactivateDepartment();
  const { mutate: activate, isPending: isActivating } =
    useActivateDepartment();

  function handleClose() {
    setTab("subjects");
    setReassigning(false);
    setDeleting(false);
    setStaffPage(1);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("view-department");
    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleEdit() {
    if (!department) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("view-department");
    params.set("edit-department", department.id);
    const query = params.toString();

    setTab("subjects");
    setReassigning(false);
    setDeleting(false);
    setStaffPage(1);
    router.push(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleDeactivate() {
    if (!department) return;

    deactivate(department.id, {
      onSuccess: () => {
        toast.success("Department deactivated");
      },
    });
  }

  function handleActivate() {
    if (!department) return;

    activate(department.id, {
      onSuccess: () => {
        toast.success("Department activated");
      },
    });
  }

  const active = department?.is_active ?? false;
  const isToggling = isDeactivating || isActivating;
  const headName = department?.head
    ? department.head.full_name ?? department.head.name ?? "Department head"
    : null;

  return (
    <FormModal
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
      title={
        <span className="flex flex-col items-start gap-1">
          <span>{department?.name ?? "Department"}</span>
          <span className="text-[14px] font-normal text-neutrals-700">
            {department?.description}
          </span>
        </span>
      }
      icon={
        department && (
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-normal"
            style={
              active
                ? { backgroundColor: "#DDF5EE", color: "#0B7B69" }
                : { backgroundColor: "#E5E5E5", color: "#6B6B6B" }
            }
          >
            {active ? "Active" : "Deactivated"}
          </span>
        )
      }
    >
      {isPending ? (
        <div className="flex h-60 items-center justify-center">
          <Spinner size={56} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-[13px] text-neutrals-700">
            {error.message || "Couldn't load this department."}
          </p>
          <Button
            type="button"
            variant="secondary"
            loading={isRefetching}
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </div>
      ) : (
        department && (
          <div className="flex w-full flex-col gap-4">
            <div role="tablist" className="flex gap-2">
              <TabButton
                label="Subjects"
                count={subjects?.length ?? department.subjects_count}
                active={tab === "subjects"}
                onClick={() => setTab("subjects")}
              />
              <TabButton
                label="Staff"
                count={staffData?.meta.total ?? department.staff_count}
                active={tab === "staff"}
                onClick={() => setTab("staff")}
              />
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[16px] border border-[#E2DDF9] bg-[#F5F5FF] px-4 py-4">
              <div className="flex min-w-0 items-center gap-4">
                <Avatar className="h-[60px] w-[60px] shrink-0">
                  <AvatarFallback className="bg-neutrals-100">
                    {headName ? (
                      initials(headName)
                    ) : (
                      <User size={24} variant="Bulk" color="#5a5555" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-[16px] uppercase text-neutrals-900">
                    Department head
                  </span>
                  <span className="truncate text-[16px] text-neutrals-800">
                    {headName ?? "No head assigned"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleEdit}
                className="h-9 shrink-0 rounded-[28px] border border-primary bg-base-white px-6 text-[14px] font-normal text-primary"
              >
                {department.head ? "Change" : "Assign"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard
                value={department.subjects_count}
                label="Subjects grouped here"
              />
              <StatCard
                value={department.staff_count}
                label="Staff in this department"
              />
            </div>

            {tab === "subjects" &&
              (isSubjectsPending ? (
                <div className="flex h-40 items-center justify-center">
                  <Spinner size={40} />
                </div>
              ) : subjectsError ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <p className="text-[13px] text-neutrals-700">
                    {subjectsError.message || "Couldn't load subjects."}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => refetchSubjects()}
                  >
                    Retry
                  </Button>
                </div>
              ) : !subjects || subjects.length === 0 ? (
                <EmptyState message="No subjects grouped under this department yet." />
              ) : (
                <ListBox>
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="border-b border-neutrals-100 px-4 py-3 text-[14px] text-neutrals-900 last:border-b-0"
                    >
                      {subject.name}
                    </div>
                  ))}
                </ListBox>
              ))}

            {tab === "staff" &&
              (isStaffPending ? (
                <div className="flex h-40 items-center justify-center">
                  <Spinner size={40} />
                </div>
              ) : staffError ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <p className="text-[13px] text-neutrals-700">
                    {staffError.message || "Couldn't load staff."}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => refetchStaff()}
                  >
                    Retry
                  </Button>
                </div>
              ) : !staffData || staffData.data.length === 0 ? (
                <EmptyState message="No staff in this department yet." />
              ) : (
                <>
                  {/* Same look as the record tables: a white header bar and
                      white rows on a lavender background, with thin gaps
                      between them. Scrolls past nine rows. */}
                  <div className="rounded-[16px] border border-[#E2DDF9] bg-[#F5F5FF] p-2">
                    <div
                      className={`grid ${STAFF_GRID} h-[34px] items-center rounded-t-[8px] border border-[#F0EBFB] bg-white px-4 text-[12px] font-medium text-neutrals-700`}
                    >
                      <span>Name</span>
                      <span>ID</span>
                      <span>Role</span>
                    </div>
                    <div className="max-h-[340px] overflow-y-auto">
                      {staffData.data.map((member) => (
                        <div
                          key={member.id}
                          className={`mt-[3px] grid ${STAFF_GRID} h-[34px] items-center bg-white px-4 text-[13px] text-neutrals-900`}
                        >
                          <span className="truncate pr-2">
                            {titleCase(member.full_name)}
                          </span>
                          <span className="truncate pr-2">
                            {member.staff_number}
                          </span>
                          <span className="truncate">
                            {titleCase(member.category)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {staffData.meta.total > 0 && (
                    <div className="overflow-hidden rounded-xl">
                      <Pagination
                        currentPage={staffData.meta.current_page}
                        totalItems={staffData.meta.total}
                        pageSize={staffData.meta.per_page}
                        onPageChange={setStaffPage}
                      />
                    </div>
                  )}
                </>
              ))}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleEdit}
                className={`${ACTION_BUTTON} border-neutrals-800 text-neutrals-900`}
              >
                <Edit size={16} variant="Bulk" color="#5a5555" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setReassigning(true)}
                className={`${ACTION_BUTTON} border-neutrals-800 text-neutrals-900`}
              >
                <ArrowSwapHorizontal size={16} variant="Bulk" color="#5a5555" />
                Reassign
              </button>
              <button
                type="button"
                onClick={active ? handleDeactivate : handleActivate}
                disabled={isToggling}
                className={`${ACTION_BUTTON} border-neutrals-800 text-neutrals-900 disabled:cursor-not-allowed disabled:opacity-60`}
              >
                <ArchiveSlash size={16} variant="Bulk" color="#5a5555" />
                {isDeactivating
                  ? "Deactivating…"
                  : isActivating
                  ? "Activating…"
                  : active
                  ? "Deactivate"
                  : "Activate"}
              </button>
              <button
                type="button"
                onClick={() => setDeleting(true)}
                className={`${ACTION_BUTTON} border-[#E5484D] text-[#D92D20]`}
              >
                <Trash size={16} variant="Bulk" color="#D92D20" />
                Delete
              </button>
            </div>

            {/* Nested inside this dialog (not a sibling) so clicks in the
                reassign modal don't count as outside clicks here. */}
            <ReassignDepartmentModal
              department={reassigning ? department : undefined}
              onClose={() => setReassigning(false)}
            />

            <DeleteDepartmentModal
              department={deleting ? department : undefined}
              onClose={() => setDeleting(false)}
              onDeleted={handleClose}
            />
          </div>
        )
      )}
    </FormModal>
  );
}
