"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowDown2 } from "iconsax-reactjs";

import FormModal from "@/components/ui/form-modal";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import ToggleField from "./ToggleField";
import { useGetStudents } from "@/features/user-management/student-management/api/get-students";
import { useAttachGuardian } from "@/features/user-management/guardian-management/api/attach-guardian";
import { useUpdateGuardianLink } from "@/features/user-management/guardian-management/api/update-guardian-links";
import { useSetPrimaryContact } from "@/features/user-management/guardian-management/api/set-primary";
import type { AttachGuardianPayload } from "@/features/user-management/guardian-management/types/attach-guardian-types";
import type { GuardianStudentLink } from "@/features/user-management/guardian-management/types/guardian-detail-types";

interface LinkStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guardianId: string;
  // When set, the modal edits this existing link instead of creating
  // a new one.
  editingStudent?: GuardianStudentLink;
}

interface LinkStudentFormValues {
  studentId: string;
  relationship: string;
  isPrimaryContact: boolean;
  isEmergencyContact: boolean;
  isFinanciallyResponsible: boolean;
  authorisedToCollect: boolean;
  receivesAcademicReports: boolean;
  receivesMedicalInfo: boolean;
  canMakeDecisions: boolean;
  hasPortalAccess: boolean;
}

const DEFAULT_VALUES: LinkStudentFormValues = {
  studentId: "",
  relationship: "",
  isPrimaryContact: true,
  isEmergencyContact: true,
  isFinanciallyResponsible: false,
  authorisedToCollect: true,
  receivesAcademicReports: true,
  receivesMedicalInfo: true,
  canMakeDecisions: true,
  hasPortalAccess: true,
};

function valuesFromLink(
  student: GuardianStudentLink
): LinkStudentFormValues {
  return {
    studentId: student.id,
    relationship: student.link.relationship,
    isPrimaryContact: student.link.is_primary_contact,
    isEmergencyContact: student.link.is_emergency_contact,
    isFinanciallyResponsible: student.link.is_financially_responsible,
    authorisedToCollect: student.link.authorised_to_collect,
    receivesAcademicReports: student.link.receives_academic_reports,
    receivesMedicalInfo: student.link.receives_medical_info,
    canMakeDecisions: student.link.can_make_decisions,
    hasPortalAccess: student.link.has_portal_access,
  };
}

const RELATIONSHIP_OPTIONS = [
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "guardian", label: "Guardian" },
  { value: "sponsor", label: "Sponsor" },
  { value: "other", label: "Other" },
];

// Responsibility rows map 1:1 onto the confirmed `link` fields from
// the real "Show A Guardian" / "Attach a guardian" specs.
const RESPONSIBILITY_ROWS: {
  name: keyof LinkStudentFormValues;
  label: string;
  description: string;
}[] = [
  {
    name: "isEmergencyContact",
    label: "Emergency contact",
    description: "Called in an emergency",
  },
  {
    name: "isFinanciallyResponsible",
    label: "Financially responsible",
    description: "Pays this child's fees",
  },
  {
    name: "authorisedToCollect",
    label: "Authorised to collect",
    description: "May pick the student up",
  },
  {
    name: "receivesAcademicReports",
    label: "Receives academic reports",
    description: "Gets this child's reports",
  },
  {
    name: "receivesMedicalInfo",
    label: "Receives medical info",
    description: "May receive medical details",
  },
  {
    name: "canMakeDecisions",
    label: "Can make decisions",
    description: "Authorised to decide",
  },
  {
    name: "hasPortalAccess",
    label: "Portal access",
    description: "May view this child in the portal",
  },
];

interface StudentOption {
  value: string;
  label: string;
}

/**
 * Local searchable combobox for the student field. The typing is
 * handed up (onQueryChange) so the parent can search on the SERVER —
 * GET /students is paginated, so filtering only the already-fetched
 * page client-side would miss every student beyond it. This component
 * deliberately does NOT filter `options` itself: the server's
 * `search` also matches admission number, which a label-only local
 * filter would wrongly hide.
 *
 * The chosen student's label is remembered locally, because the
 * options list changes with every search and the selected student may
 * not be in the current results.
 */
function SearchableStudentSelect({
  options,
  value,
  onChange,
  onQueryChange,
  isSearching,
}: {
  options: StudentOption[];
  value: string;
  onChange: (next: string) => void;
  onQueryChange: (query: string) => void;
  isSearching: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<StudentOption | undefined>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Derived, not synced: the remembered option only counts while it
  // still matches the form's current value. A form reset sets value
  // back to "", so the label disappears with no effect needed to
  // clear it.
  const selectedLabel =
    selected && selected.value === value ? selected.label : undefined;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery("");
        onQueryChange("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onQueryChange]);

  function handleSelect(option: StudentOption) {
    onChange(option.value);
    setSelected(option);
    setIsOpen(false);
    setQuery("");
    onQueryChange("");
  }

  function handleQueryChange(next: string) {
    setQuery(next);
    onQueryChange(next);
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-14 w-full items-center justify-between rounded-2xl bg-primary-bg px-5 py-4 text-left"
      >
        <span
          className={
            selectedLabel
              ? "text-[14px] text-neutrals-900"
              : "text-[14px] text-neutrals-400"
          }
        >
          {selectedLabel ?? "Select student"}
        </span>
        <ArrowDown2 size={16} variant="Linear" color="currentColor" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-full overflow-hidden rounded-2xl border border-primary-100 bg-base-white shadow-lg">
          <input
            autoFocus
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Search by name or admission no…"
            className="w-full border-b border-primary-100 px-4 py-3 text-[13px] outline-none"
          />
          <div className="max-h-60 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-[13px] text-neutrals-500">
                {isSearching
                  ? "Searching…"
                  : query
                    ? `No students match "${query}".`
                    : "No students found."}
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`flex w-full items-center px-4 py-2 text-left text-[13px] hover:bg-primary-bg ${
                    option.value === value
                      ? "font-semibold text-primary"
                      : "text-neutrals-700"
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default function LinkStudentModal({
  open,
  onOpenChange,
  guardianId,
  editingStudent,
}: LinkStudentModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!editingStudent;

  // Server-side student search, debounced so it isn't one request per
  // keystroke.
  const [studentQuery, setStudentQuery] = useState("");
  const [debouncedStudentQuery, setDebouncedStudentQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedStudentQuery(studentQuery.trim()),
      300
    );
    return () => clearTimeout(timer);
  }, [studentQuery]);

  const { data: students, isFetching: isSearchingStudents } = useGetStudents({
    search: debouncedStudentQuery || undefined,
  });
  const studentOptions: StudentOption[] = (students?.data ?? []).map(
    (student) => ({
      value: student.id,
      label: student.full_name,
    })
  );

  const methods = useForm<LinkStudentFormValues>({
    defaultValues: editingStudent
      ? valuesFromLink(editingStudent)
      : DEFAULT_VALUES,
  });
  const { control, handleSubmit, reset, formState } = methods;

  const attachGuardianMutation = useAttachGuardian();
  const updateLinkMutation = useUpdateGuardianLink();
  const setPrimaryMutation = useSetPrimaryContact();

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      setStudentQuery("");
    }
    onOpenChange(nextOpen);
  }

  function extractErrorMessage(error: unknown, fallback: string): string {
    return error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : fallback;
  }

  const onSubmit = async (values: LinkStudentFormValues) => {
    // Guard first: an empty studentId would build the URL
    // `students//guardians`.
    if (!values.studentId || !values.relationship) {
      toast.error("Select a student and their relationship to continue.");
      return;
    }

    if (isEdit && editingStudent) {
      try {
        await updateLinkMutation.mutateAsync({
          studentId: editingStudent.id,
          guardianId,
          payload: {
            relationship: values.relationship,
            is_emergency_contact: values.isEmergencyContact,
            is_financially_responsible: values.isFinanciallyResponsible,
            authorised_to_collect: values.authorisedToCollect,
            receives_academic_reports: values.receivesAcademicReports,
            receives_medical_info: values.receivesMedicalInfo,
            can_make_decisions: values.canMakeDecisions,
            has_portal_access: values.hasPortalAccess,
          },
        });

        // The flags are saved first. If set-primary then fails, the
        // flag changes are kept and the error toast shows.
        if (
          values.isPrimaryContact &&
          !editingStudent.link.is_primary_contact
        ) {
          await setPrimaryMutation.mutateAsync({
            studentId: editingStudent.id,
            guardianId,
          });
        }

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["guardians", guardianId],
          }),
          queryClient.invalidateQueries({
            queryKey: ["students", editingStudent.id],
          }),
        ]);

        toast.success("Link updated");
        handleOpenChange(false);
      } catch (error) {
        console.error("Failed to update link:", error);
        toast.error(
          extractErrorMessage(error, "Failed to update link. Please try again.")
        );
      }
      return;
    }

    const payload: AttachGuardianPayload = {
      guardian_id: guardianId,
      relationship: values.relationship,
      is_primary_contact: values.isPrimaryContact,
      is_emergency_contact: values.isEmergencyContact,
      is_financially_responsible: values.isFinanciallyResponsible,
      authorised_to_collect: values.authorisedToCollect,
      receives_academic_reports: values.receivesAcademicReports,
      receives_medical_info: values.receivesMedicalInfo,
      can_make_decisions: values.canMakeDecisions,
      has_portal_access: values.hasPortalAccess,
    };

    try {
      await attachGuardianMutation.mutateAsync({
        studentId: values.studentId,
        payload,
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["guardians", guardianId] }),
        queryClient.invalidateQueries({
          queryKey: ["students", values.studentId],
        }),
      ]);

      toast.success("Student linked successfully");
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to link student:", error);
      toast.error(
        extractErrorMessage(error, "Failed to link student. Please try again.")
      );
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? "Edit Link" : "Link Student"}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6"
        >
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-medium uppercase tracking-wide text-neutrals-500">
              Details
            </span>

            {isEdit ? (
              <div className="flex h-14 items-center rounded-2xl bg-primary-bg px-5 text-[14px] text-neutrals-900">
                {editingStudent?.full_name}
              </div>
            ) : (
              <Controller
                name="studentId"
                control={control}
                render={({ field }) => (
                  <SearchableStudentSelect
                    options={studentOptions}
                    value={field.value}
                    onChange={field.onChange}
                    onQueryChange={setStudentQuery}
                    isSearching={isSearchingStudents}
                  />
                )}
              />
            )}

            <Select
              name="relationship"
              placeholder="Relationship to student"
              options={RELATIONSHIP_OPTIONS}
            />

            <Controller
              name="isPrimaryContact"
              control={control}
              render={({ field }) => (
                <ToggleField
                  label="Make this guardian the student's primary contact"
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={
                    isEdit && !!editingStudent?.link.is_primary_contact
                  }
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-medium uppercase tracking-wide text-neutrals-500">
              Responsibilities
            </span>

            {RESPONSIBILITY_ROWS.map((row) => (
              <Controller
                key={row.name}
                name={row.name}
                control={control}
                render={({ field }) => (
                  <ToggleField
                    label={row.label}
                    description={row.description}
                    checked={field.value as boolean}
                    onChange={field.onChange}
                  />
                )}
              />
            ))}
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
                attachGuardianMutation.isPending ||
                updateLinkMutation.isPending ||
                setPrimaryMutation.isPending
              }
              className="h-14 flex-1 rounded-[28px]"
            >
              {isEdit ? "Save" : "Link"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}