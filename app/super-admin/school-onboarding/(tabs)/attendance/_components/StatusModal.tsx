"use client";

import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { TickSquare } from "iconsax-reactjs";

import FormModal from "@/components/ui/form-modal";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useCreateAttendanceStatus } from "@/features/attendance/api/create-attendance-status";
import { useUpdateAttendanceStatus } from "@/features/attendance/api/update-attendance-status";
import type {
  AttendanceStatus,
  AttendanceStatusCategory,
  CreateAttendanceStatusPayload,
} from "@/features/attendance/types/attendance-status-types";

interface AttendanceStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // When set, the modal edits this status instead of creating one.
  editingStatus?: AttendanceStatus;
}

interface StatusFormValues {
  name: string;
  code: string;
  category: AttendanceStatusCategory | "";
  colour: string;
  countsAsPresent: boolean;
  isAuthorised: boolean;
  requiresReason: boolean;
  requiresDocument: boolean;
}

const DEFAULT_VALUES: StatusFormValues = {
  name: "",
  code: "",
  category: "",
  colour: "",
  countsAsPresent: false,
  isAuthorised: false,
  requiresReason: false,
  requiresDocument: false,
};

const CATEGORY_OPTIONS: { value: AttendanceStatusCategory; label: string }[] = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "excused", label: "Excused" },
];

// The design has a colour dropdown rather than a free hex field, so
// these are preset choices (the value sent to the API is the hex).
// The palette is a placeholder — swap in the design's real colours.
const COLOUR_OPTIONS = [
  { value: "#1F7A4D", label: "Green" },
  { value: "#B42318", label: "Red" },
  { value: "#D97706", label: "Orange" },
  { value: "#6D4AFF", label: "Purple" },
  { value: "#1D7FD1", label: "Blue" },
  { value: "#6B7280", label: "Grey" },
  { value: "#1A1A1A", label: "Black" },
];

function valuesFromStatus(status: AttendanceStatus): StatusFormValues {
  return {
    name: status.name,
    code: status.code,
    category: status.category,
    colour: status.colour,
    countsAsPresent: status.counts_as_present,
    isAuthorised: status.is_authorised,
    requiresReason: status.requires_reason,
    requiresDocument: status.requires_document,
  };
}

function extractErrorMessage(error: unknown, fallback: string): string {
  return error && typeof error === "object" && "message" in error
    ? String((error as { message: unknown }).message)
    : fallback;
}

// Local checkbox — no shared Checkbox component was found. Swap this
// out if one already exists elsewhere. Checked state uses the iconsax
// "tick-square" (Bulk) icon, matching the toggles' icon set; unchecked
// is an empty rounded square the same size as the icon's drawn square.
function CheckboxField({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 text-left text-[14px] text-neutrals-900 ${
        disabled ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        {checked ? (
          <TickSquare size={24} variant="Bulk" color="#010081" />
        ) : (
          <span
            className="h-5 w-5 rounded-sm border-2 border-neutrals-400"
            aria-hidden="true"
          />
        )}
      </span>
      {label}
    </button>
  );
}

/**
 * Create / edit an attendance status.
 *   CREATE — POST /attendance-statuses
 *   EDIT   — PUT  /attendance-statuses/{status} (same fields)
 *
 * Client-side checks mirror the server's rules so users get field
 * errors first: code is required and at most 8 characters (uniqueness
 * is only checkable by the server), and a status that requires a
 * document must also require a reason.
 */
export default function AttendanceStatusModal({
  open,
  onOpenChange,
  editingStatus,
}: AttendanceStatusModalProps) {
  const isEdit = !!editingStatus;

  const methods = useForm<StatusFormValues>({
    defaultValues: editingStatus
      ? valuesFromStatus(editingStatus)
      : DEFAULT_VALUES,
  });
  const { control, handleSubmit, reset, setError, setValue, formState } =
    methods;

  const values = useWatch({ control });

  const createMutation = useCreateAttendanceStatus();
  const updateMutation = useUpdateAttendanceStatus();

  // An existing status can have a colour that isn't in the preset
  // palette; keep it selectable so editing doesn't blank it.
  const colourOptions =
    editingStatus &&
    !COLOUR_OPTIONS.some((o) => o.value === editingStatus.colour)
      ? [
          { value: editingStatus.colour, label: editingStatus.colour },
          ...COLOUR_OPTIONS,
        ]
      : COLOUR_OPTIONS;

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  const onSubmit = async (formValues: StatusFormValues) => {
    const name = formValues.name.trim();
    const code = formValues.code.trim();

    let invalid = false;
    if (!name) {
      setError("name", { message: "Name is required" });
      invalid = true;
    }
    if (!code) {
      setError("code", { message: "Code is required" });
      invalid = true;
    } else if (code.length > 8) {
      setError("code", { message: "Code can be at most 8 characters" });
      invalid = true;
    }
    if (!formValues.category) {
      setError("category", { message: "Choose a category" });
      invalid = true;
    }
    if (invalid || !formValues.category) return;

    const payload: CreateAttendanceStatusPayload = {
      name,
      code,
      category: formValues.category,
      colour: formValues.colour || undefined,
      counts_as_present: formValues.countsAsPresent,
      is_authorised: formValues.isAuthorised,
      requires_reason: formValues.requiresReason,
      requires_document: formValues.requiresDocument,
    };

    try {
      if (editingStatus) {
        await updateMutation.mutateAsync({
          statusId: editingStatus.id,
          payload,
        });
        toast.success("Status updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Status created");
      }
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to save attendance status:", error);
      toast.error(
        extractErrorMessage(error, "Failed to save status. Please try again.")
      );
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? "Edit Status" : "Add Status"}
      maxWidth="max-w-144"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6"
        >
          <div className="flex flex-col gap-3">
            <Input name="name" label="Enter status name" />
            <Input name="code" label="Enter status code" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Select
                name="category"
                label="Select status category"
                options={CATEGORY_OPTIONS}
              />
              <Select
                name="colour"
                label="Select status color"
                options={colourOptions}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-medium text-neutrals-900">
              Behaviour
            </span>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <CheckboxField
                label="Counts as present (%)"
                checked={!!values.countsAsPresent}
                onChange={(next) =>
                  setValue("countsAsPresent", next, { shouldDirty: true })
                }
              />
              {/* The design's second box is also labelled "Counts as
                  present"; "Authorised" (is_authorised) is the other
                  flag the status table shows, so it's used here. */}
              <CheckboxField
                label="Authorised"
                checked={!!values.isAuthorised}
                onChange={(next) =>
                  setValue("isAuthorised", next, { shouldDirty: true })
                }
              />
              <CheckboxField
                label="Requires a reason"
                checked={!!values.requiresReason}
                // A status that needs a document needs a reason too.
                disabled={!!values.requiresDocument}
                onChange={(next) =>
                  setValue("requiresReason", next, { shouldDirty: true })
                }
              />
              <CheckboxField
                label="Requires a document"
                checked={!!values.requiresDocument}
                onChange={(next) => {
                  setValue("requiresDocument", next, { shouldDirty: true });
                  if (next) {
                    setValue("requiresReason", true, { shouldDirty: true });
                  }
                }}
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
              loading={
                formState.isSubmitting ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              className="h-14 flex-1 rounded-[28px]"
            >
              {isEdit ? "Save" : "Create Status"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}