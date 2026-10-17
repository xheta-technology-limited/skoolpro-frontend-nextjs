"use client";

import { useState } from "react";
import { toast } from "sonner";

import RecordTableSection, {
  type RecordTableRow,
} from "@/components/common/record-table-section/RecordTableSection";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { ApiError } from "@/lib/api";
import { useGetAttendanceStatuses } from "@/features/attendance/api/get-attendance-statuses";
import { useGetAttendanceRules } from "@/features/attendance/api/get-attendance-rules";
import { useDeleteAttendanceStatus } from "@/features/attendance/api/delete-attendance-status";
import { useDeleteAttendanceRule } from "@/features/attendance/api/delete-attendance-rule";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import type {
  AttendanceRule,
} from "@/features/attendance/types/attendance-rule-types";
import type { AttendanceStatus } from "@/features/attendance/types/attendance-status-types";

import AttendanceStatusModal from "./_components/StatusModal";
import AttendanceRuleModal from "./_components/RuleModal";
import Header from "../../_components/header";

const SCHOOL_COLOUR = "#0B7B69";
const LEVEL_COLOUR = "#0088FF";
const WARN_COLOUR = "#CC7914";
const CRITICAL_COLOUR = "#8C1823";

const yesNo = (value: boolean) => (value ? "Yes" : "No");

function formatNeeds(status: AttendanceStatus): string {
  if (status.requires_document) return "Reason + Doc";
  if (status.requires_reason) return "Reason";
  return "-";
}

// "08:00:00" -> "8:00 AM"
function formatTime12(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${period}`;
}

// "08:00:00" -> "08:00"
const formatTime24 = (time: string) => time.slice(0, 5);

function SummaryItem({
  label,
  value,
  colour,
}: {
  label: string;
  value: string;
  colour?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] text-neutrals-500">{label}</span>
      <span
        className="text-[14px] font-medium text-neutrals-900"
        style={{ color: colour }}
      >
        {value}
      </span>
    </div>
  );
}

export default function AttendancePage() {
  const statusesQuery = useGetAttendanceStatuses();
  const rulesQuery = useGetAttendanceRules();
  const { data: levels } = useListLevels();

  const [statusModal, setStatusModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<
    AttendanceStatus | undefined
  >();
  const [ruleModal, setRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AttendanceRule | undefined>();

  const [deletingStatus, setDeletingStatus] = useState<
    AttendanceStatus | undefined
  >();
  const [deletingRule, setDeletingRule] = useState<
    AttendanceRule | undefined
  >();
  const { mutate: deleteStatus, isPending: isDeletingStatus } =
    useDeleteAttendanceStatus();
  const { mutate: deleteRule, isPending: isDeletingRule } =
    useDeleteAttendanceRule();

  const onDeleteStatus = () => {
    if (!deletingStatus) return;
    deleteStatus(
      { statusId: deletingStatus.id },
      {
        onSuccess: () => toast.success("Status deleted"),
        onError: (err) => {
          if (!(err instanceof ApiError)) {
            toast.error(err.message || "Failed to delete status.");
          }
        },
        onSettled: () => setDeletingStatus(undefined),
      }
    );
  };

  const onDeleteRule = () => {
    if (!deletingRule) return;
    deleteRule(
      { ruleId: deletingRule.id },
      {
        onSuccess: () => toast.success("Rule deleted"),
        onError: (err) => {
          if (!(err instanceof ApiError)) {
            toast.error(err.message || "Failed to delete rule.");
          }
        },
        onSettled: () => setDeletingRule(undefined),
      }
    );
  };

  if (statusesQuery.isPending || rulesQuery.isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }

  const error = statusesQuery.error ?? rulesQuery.error;
  const statuses = statusesQuery.data;
  const rules = rulesQuery.data;

  if (error || !statuses || !rules) {
    return (
      <div className="w-fit mx-auto">
        <NoData
          variant="signal"
          title="Something went wrong"
          subTitle={error?.message || ""}
          className="w-97.5 h-143.75"
        />
        <Button
          className="mt-3 w-full"
          loading={statusesQuery.isRefetching || rulesQuery.isRefetching}
          onClick={() => {
            statusesQuery.refetch();
            rulesQuery.refetch();
          }}
          size="lg"
        >
          Retry
        </Button>
      </div>
    );
  }

  const levelName = (id: string | null) =>
    id
      ? (levels?.find((level) => level.id === id)?.name ?? "Education level")
      : "School default";

  const sortedStatuses = [...statuses].sort((a, b) => a.sequence - b.sequence);

  // The school-wide rule has no education level (more reliable than
  // matching on scope_type, whose non-school values aren't confirmed).
  const schoolRule = rules.find((rule) => !rule.education_level_id);

  return (
    <div className="p-6">
    <Header label="Attendance" />
    <div className="mb-8 flex w-full flex-col gap-4 rounded-2xl border border-grays-borders bg-white p-4">
    {/* <div className="flex flex-col gap-8 w-full"> */}
      <RecordTableSection
        title="Attendance status"
        columns={[
          { key: "name", label: "Status" },
          { key: "code", label: "Code" },
          { key: "category", label: "Category" },
          { key: "countsPresent", label: "Counts present" },
          { key: "authorised", label: "Authorised" },
          { key: "needs", label: "Needs" },
        ]}
        rows={sortedStatuses.map(
          (status): RecordTableRow => ({
            id: status.id,
            cells: {
              name: status.name,
              code: status.code,
              category:
                status.category.charAt(0).toUpperCase() +
                status.category.slice(1),
              countsPresent: yesNo(status.counts_as_present),
              authorised: yesNo(status.is_authorised),
              needs: formatNeeds(status),
            },
            cellColors: { name: status.colour },
          })
        )}
        onAdd={() => {
          setEditingStatus(undefined);
          setStatusModal(true);
        }}
        onEditRow={(rowId) => {
          const status = statuses.find((s) => s.id === rowId);
          if (status) {
            setEditingStatus(status);
            setStatusModal(true);
          }
        }}
        onDeleteRow={(rowId) =>
          setDeletingStatus(statuses.find((s) => s.id === rowId))
        }
        deletingRowId={isDeletingStatus ? deletingStatus?.id : null}
        requireAtLeastOne={false}
        addLabel="Add Status"
        emptyLabel="No attendance statuses yet."
      />

      <RecordTableSection
        title="Late and absence rule"
        columns={[
          { key: "scope", label: "Scope" },
          { key: "lateAfter", label: "Late after" },
          { key: "notifyAfter", label: "Notify after" },
          { key: "thresholds", label: "Warn/Critical" },
        ]}
        rows={rules.map(
          (rule): RecordTableRow => ({
            id: rule.id,
            cells: {
              scope: levelName(rule.education_level_id),
              lateAfter: `${formatTime24(rule.late_after)} (+${rule.grace_minutes})`,
              notifyAfter: `${rule.absence_notify_after} in a row`,
              thresholds: `${rule.attendance_percent_warn}/${rule.attendance_percent_critical}`,
            },
            cellColors: {
              scope: rule.education_level_id ? LEVEL_COLOUR : SCHOOL_COLOUR,
            },
          })
        )}
        onAdd={() => {
          setEditingRule(undefined);
          setRuleModal(true);
        }}
        onEditRow={(rowId) => {
          const rule = rules.find((r) => r.id === rowId);
          if (rule) {
            setEditingRule(rule);
            setRuleModal(true);
          }
        }}
        onDeleteRow={(rowId) =>
          setDeletingRule(rules.find((r) => r.id === rowId))
        }
        deletingRowId={isDeletingRule ? deletingRule?.id : null}
        requireAtLeastOne={false}
        addLabel="Add Rule"
        emptyLabel="No rules set yet."
      >
        {schoolRule && (
          <div className="flex flex-col gap-4 rounded-2xl border border-primary-100 bg-white p-5">
            <span className="text-[14px] font-medium text-neutrals-900">
              School default
            </span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryItem
                label="Late after (+ grace)"
                value={`${formatTime12(schoolRule.late_after)} + ${schoolRule.grace_minutes}min`}
              />
              <SummaryItem
                label="Lateness/Intervention"
                value={`${schoolRule.late_count_threshold} occurrences`}
              />
              <SummaryItem
                label="Notify guardian after"
                value={`${schoolRule.absence_notify_after} absences in a row`}
              />
              <SummaryItem
                label="Escalate after"
                value={`${schoolRule.absence_escalate_after} absences in a row`}
              />
              <SummaryItem
                label="Warn below"
                value={`${schoolRule.attendance_percent_warn}% attendance`}
                colour={WARN_COLOUR}
              />
              <SummaryItem
                label="Critical below"
                value={`${schoolRule.attendance_percent_critical}% attendance`}
                colour={CRITICAL_COLOUR}
              />
            </div>
          </div>
        )}
      </RecordTableSection>

      <AttendanceStatusModal
        key={editingStatus?.id ?? "new-status"}
        open={statusModal}
        onOpenChange={setStatusModal}
        editingStatus={editingStatus}
      />

      <AttendanceRuleModal
        key={editingRule?.id ?? "new-rule"}
        open={ruleModal}
        onOpenChange={setRuleModal}
        editingRule={editingRule}
      />

      <FormModal
        open={!!deletingStatus}
        onOpenChange={(next) => {
          if (!next) setDeletingStatus(undefined);
        }}
        title={`Delete ${deletingStatus?.name ?? "status"}?`}
        maxWidth="max-w-112"
      >
        <p className="text-[14px] text-neutrals-700">
          This removes the status. A register needs at least one
          present-counting and one absent status, so the last of either
          can&apos;t be deleted.
        </p>
        <div className="flex items-center justify-between">
          <Button onClick={() => setDeletingStatus(undefined)}>No</Button>
          <Button
            variant="secondary"
            loading={isDeletingStatus}
            onClick={onDeleteStatus}
            className="border-error-200! text-error-200!"
          >
            Yes, delete
          </Button>
        </div>
      </FormModal>

      <FormModal
        open={!!deletingRule}
        onOpenChange={(next) => {
          if (!next) setDeletingRule(undefined);
        }}
        title={`Delete rule for ${
          deletingRule
            ? levelName(deletingRule.education_level_id)
            : "this scope"
        }?`}
        maxWidth="max-w-112"
      >
        <p className="text-[14px] text-neutrals-700">
          This removes the late and absence rule for this scope.
        </p>
        <div className="flex items-center justify-between">
          <Button onClick={() => setDeletingRule(undefined)}>No</Button>
          <Button
            variant="secondary"
            loading={isDeletingRule}
            onClick={onDeleteRule}
            className="border-error-200! text-error-200!"
          >
            Yes, delete
          </Button>
        </div>
      </FormModal>
    </div>
    </div>
  );
}