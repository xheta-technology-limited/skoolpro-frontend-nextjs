"use client";

import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import FormModal from "@/components/ui/form-modal";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useSetAttendanceRule } from "@/features/attendance/api/set-attendance-rule";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import type {
  AttendanceRule,
  SetAttendanceRulePayload,
} from "@/features/attendance/types/attendance-rule-types";

interface AttendanceRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // When set, the modal edits this rule. Its scope can't change — the
  // endpoint upserts per scope, so a different scope would be a
  // different rule.
  editingRule?: AttendanceRule;
}

const SCHOOL_SCOPE = "school";

interface RuleFormValues {
  // "school" for the school-wide rule, otherwise an education level id.
  scopeKey: string;
  // Numbers are held as strings so the inputs stay controlled and an
  // empty field can mean "not set".
  lateAfter: string; // "HH:mm"
  graceMinutes: string;
  lateCountThreshold: string;
  absenceNotifyAfter: string;
  absenceEscalateAfter: string;
  percentWarn: string;
  percentCritical: string;
}

const DEFAULT_VALUES: RuleFormValues = {
  scopeKey: SCHOOL_SCOPE,
  lateAfter: "",
  graceMinutes: "",
  lateCountThreshold: "",
  absenceNotifyAfter: "",
  absenceEscalateAfter: "",
  percentWarn: "",
  percentCritical: "",
};

const toStr = (n: number | null | undefined) => (n == null ? "" : String(n));

function valuesFromRule(rule: AttendanceRule): RuleFormValues {
  return {
    // A school-wide rule has no education level.
    scopeKey: rule.education_level_id ?? SCHOOL_SCOPE,
    lateAfter: rule.late_after ? rule.late_after.slice(0, 5) : "",
    graceMinutes: toStr(rule.grace_minutes),
    lateCountThreshold: toStr(rule.late_count_threshold),
    absenceNotifyAfter: toStr(rule.absence_notify_after),
    absenceEscalateAfter: toStr(rule.absence_escalate_after),
    percentWarn: toStr(rule.attendance_percent_warn),
    percentCritical: toStr(rule.attendance_percent_critical),
  };
}

function extractErrorMessage(error: unknown, fallback: string): string {
  return error && typeof error === "object" && "message" in error
    ? String((error as { message: unknown }).message)
    : fallback;
}

/**
 * Create / edit a late-and-absence rule. Both use the one endpoint:
 * POST /attendance-rules upserts per scope, so saving a scope that
 * already has a rule updates it.
 *
 * The design has no fields for "absence requires evidence" or notify
 * channels. When editing, the rule's existing values for those two are
 * sent back unchanged so an upsert can't blank them; when creating
 * they're simply omitted.
 *
 * Client-side checks mirror the server's 422 rules: percentages
 * between 0 and 100, and critical at or below warn.
 */
export default function AttendanceRuleModal({
  open,
  onOpenChange,
  editingRule,
}: AttendanceRuleModalProps) {
  const isEdit = !!editingRule;

  const { data: levels } = useListLevels();
  const scopeOptions = [
    { value: SCHOOL_SCOPE, label: "School default" },
    ...(levels ?? []).map((level) => ({
      value: level.id,
      label: level.name,
    })),
  ];

  const methods = useForm<RuleFormValues>({
    defaultValues: editingRule ? valuesFromRule(editingRule) : DEFAULT_VALUES,
  });
  const { handleSubmit, reset, setError, formState } = methods;

  const setRuleMutation = useSetAttendanceRule();

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  const onSubmit = async (values: RuleFormValues) => {
    let invalid = false;

    // "" -> undefined (not set); anything non-numeric -> NaN (invalid).
    const num = (v: string) => (v.trim() === "" ? undefined : Number(v));
    const check = (
      field: keyof RuleFormValues,
      value: number | undefined,
      opts: { max?: number; label: string }
    ) => {
      if (value === undefined) return;
      if (Number.isNaN(value) || value < 0) {
        setError(field, { message: `${opts.label} must be a number` });
        invalid = true;
      } else if (opts.max !== undefined && value > opts.max) {
        setError(field, { message: `${opts.label} must be 0–${opts.max}` });
        invalid = true;
      }
    };

    const grace = num(values.graceMinutes);
    const lateCount = num(values.lateCountThreshold);
    const notifyAfter = num(values.absenceNotifyAfter);
    const escalateAfter = num(values.absenceEscalateAfter);
    const warn = num(values.percentWarn);
    const critical = num(values.percentCritical);

    check("graceMinutes", grace, { label: "Grace minutes" });
    check("lateCountThreshold", lateCount, { label: "Late occurrences" });
    check("absenceNotifyAfter", notifyAfter, { label: "Notify after" });
    check("absenceEscalateAfter", escalateAfter, { label: "Escalate after" });
    check("percentWarn", warn, { label: "Warning %", max: 100 });
    check("percentCritical", critical, { label: "Critical %", max: 100 });

    if (
      warn !== undefined &&
      critical !== undefined &&
      !Number.isNaN(warn) &&
      !Number.isNaN(critical) &&
      critical > warn
    ) {
      setError("percentCritical", {
        message: "Critical must be at or below the warning %",
      });
      invalid = true;
    }

    const lateAfter = values.lateAfter.trim();
    if (lateAfter && !/^\d{2}:\d{2}$/.test(lateAfter)) {
      setError("lateAfter", { message: "Use HH:mm, e.g. 08:00" });
      invalid = true;
    }

    if (invalid) return;

    const settings = {
      late_after: lateAfter || undefined,
      grace_minutes: grace,
      late_count_threshold: lateCount,
      absence_notify_after: notifyAfter,
      absence_escalate_after: escalateAfter,
      attendance_percent_warn: warn,
      attendance_percent_critical: critical,
      // Not in the design — carried over unchanged when editing.
      absence_requires_evidence: editingRule?.absence_requires_evidence,
      notify_channels: editingRule?.notify_channels,
    };

    const payload: SetAttendanceRulePayload =
      values.scopeKey === SCHOOL_SCOPE
        ? { scope: "school", ...settings }
        : {
            scope: "level",
            education_level_id: values.scopeKey,
            ...settings,
          };

    try {
      await setRuleMutation.mutateAsync(payload);
      toast.success(isEdit ? "Rule updated" : "Rule saved");
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to save attendance rule:", error);
      toast.error(
        extractErrorMessage(error, "Failed to save rule. Please try again.")
      );
    }
  };

  const editingScopeLabel = scopeOptions.find(
    (o) => o.value === (editingRule?.education_level_id ?? SCHOOL_SCOPE)
  )?.label;

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Late & Absence Rule"
      maxWidth="max-w-144"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6"
        >
          {isEdit ? (
            <div className="flex h-14 items-center rounded-2xl bg-primary-bg px-5 text-[14px] text-neutrals-500">
              {editingScopeLabel ?? "Education level"}
            </div>
          ) : (
            <Select
              name="scopeKey"
              label="Select scope"
              options={scopeOptions}
            />
          )}

          <div className="flex flex-col gap-3">
            <span className="text-[16px] font-medium text-neutrals-700">
              Lateness
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input name="lateAfter" label="Late after" type="time" />
              <Input name="graceMinutes" label="Grace (min)" type="number" />
              <Input
                name="lateCountThreshold"
                label="Late/Intervention"
                type="number"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[16px] font-medium text-neutrals-700">
              Absence
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                name="absenceNotifyAfter"
                label="Notify after (in a row)"
                type="number"
              />
              <Input
                name="absenceEscalateAfter"
                label="Escalate after (in a row)"
                type="number"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[16px] font-medium text-neutrals-700">
              Attendance (%)
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input name="percentWarn" label="Warn below (%)" type="number" />
              <Input
                name="percentCritical"
                label="Critical below (%)"
                type="number"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="flex h-14 flex-1 items-center justify-center rounded-[28px] border border-primary bg-base-white px-8 py-4"
            >
              <span className="text-[16px] font-normal leading-[1.2] text-primary">
                Cancel
              </span>
            </button>

            <Button
              type="submit"
              loading={formState.isSubmitting || setRuleMutation.isPending}
              className="h-14 flex-1 rounded-[28px]"
            >
              {isEdit ? "Save" : "Create Rule"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}