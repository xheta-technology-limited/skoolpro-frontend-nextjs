"use client";

import { useParams } from "next/navigation";
import { AttachSquare } from "iconsax-reactjs";

import { Button } from "@/components/ui/custom-button";
import { StatusBadge } from "@/components/common";
import { useGetStudent } from "@/features/user-management/student-management/api/get-student";
import { useTransitionStudent } from "@/features/user-management/student-management/api/transition-student";
import type { TransitionAction } from "@/features/user-management/student-management/types/transition-student-types";
import {
  formatStudentStatus,
  getStudentStatusVariant,
} from "@/features/user-management/student-management/utils/student-status";

interface RoleAction {
  action: TransitionAction;
  label: string;
  tone: "primary" | "danger";
  fromStatuses: string[] | "any";
}

const ROLE_ACTIONS: RoleAction[] = [
  {
    action: "graduate",
    label: "Graduate",
    tone: "primary",
    fromStatuses: ["active"],
  },
  {
    action: "reinstate",
    label: "Reinstate",
    tone: "primary",
    fromStatuses: ["suspended", "inactive"],
  },
  {
    action: "mark-alumni",
    label: "Mark alumni",
    tone: "primary",
    fromStatuses: ["graduated"],
  },
  {
    action: "suspend",
    label: "Suspend",
    tone: "primary",
    fromStatuses: ["active"],
  },
  {
    action: "deactivate",
    label: "Deactivate",
    tone: "primary",
    fromStatuses: ["active"],
  },
  {
    action: "withdraw",
    label: "Withdraw",
    tone: "danger",
    fromStatuses: ["active", "inactive", "suspended"],
  },
  {
    action: "transfer",
    label: "Transfer out",
    tone: "danger",
    fromStatuses: ["active", "inactive"],
  },
  {
    action: "expel",
    label: "Expel",
    tone: "danger",
    fromStatuses: ["active", "suspended"],
  },
  {
    action: "mark-deceased",
    label: "Mark deceased",
    tone: "danger",
    fromStatuses: "any",
  },
];

function titleCase(value: string) {
  return value
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function StudentStatusPage() {
  const params = useParams<{ studentId: string }>();
  const studentId = params.studentId;

  const { data: student, isPending, isError, refetch } = useGetStudent(studentId);
  const { mutate, isPending: isTransitioning, variables } =
    useTransitionStudent(studentId);

  if (isPending) {
    return (
      <div className="flex min-h-60 w-full items-center justify-center">
        <span className="text-[13px] text-neutrals-500">
          Loading student…
        </span>
      </div>
    );
  }

  if (isError || !student) {
    return (
      <div className="flex min-h-60 w-full items-center justify-center">
        <span className="text-[13px] text-neutrals-500">
          Unable to load this student.
        </span>
      </div>
    );
  }

  const currentStatus = student.student_status?.toLowerCase() ?? "active";
  const badgeVariant = getStudentStatusVariant(currentStatus);

  function handleTransition(action: TransitionAction) {
    mutate(
      { action },
      {
        onSuccess: () => {
          refetch();
        },
        onError: (error) => {
          alert(
            error?.message ??
              "That status change isn't allowed right now."
          );
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-poppins text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
            ROLE STATUS
          </span>
          <StatusBadge
            data={formatStudentStatus(currentStatus)}
            variant={badgeVariant}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {ROLE_ACTIONS.map((roleAction) => {
            const isAllowed =
              roleAction.fromStatuses === "any"
                ? currentStatus !== roleAction.action.replace("mark-", "")
                : roleAction.fromStatuses.includes(currentStatus);
            const isThisActionLoading =
              isTransitioning && variables?.action === roleAction.action;

            return (
              <Button
                key={roleAction.action}
                type="button"
                variant="secondary"
                size="md"
                disabled={!isAllowed || isTransitioning}
                loading={isThisActionLoading}
                onClick={() => handleTransition(roleAction.action)}
                leftIcon={
                  <AttachSquare
                    size={20}
                    variant="Bulk"
                    color="currentColor"
                  />
                }
                className={
                  roleAction.tone === "danger"
                    ? "border-error-200! text-error-200!"
                    : undefined
                }
              >
                {roleAction.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="font-poppins text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
          ADMISSION STATUS
        </span>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
          <div className="w-full lg:w-118.5 lg:shrink-0">
            <label
              htmlFor="admission_status"
              className="mb-2 block font-poppins text-base font-normal leading-[120%] tracking-normal text-neutrals-700"
            >
              Admission status
            </label>
            <div
              id="admission_status"
              className="flex min-h-12.75 w-full items-center rounded-2xl bg-primary-bg px-5 py-4 text-[0.875rem] text-neutrals-400 md:text-[1rem] lg:h-12.75"
            >
              {titleCase(student.admission_status ?? "Enrolled")}
            </div>
          </div>

          <p className="flex-1 font-poppins text-base font-normal leading-[120%] tracking-normal text-neutrals-700 sm:pt-7">
            applicant → offered → accepted → enrolled · deferred / waitlisted
            / rejected / withdrawn
          </p>
        </div>
      </div>
    </div>
  );
}