"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowDown2 } from "iconsax-reactjs";

import FormModal from "@/components/ui/form-modal";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import ToggleField from "@/app/super-admin/user-management/parent-management/[guardianId]/general/_components/ToggleField";
import { useGetGuardians } from "@/features/user-management/guardian-management/api/get-guardians";
import { useAttachGuardian } from "@/features/user-management/guardian-management/api/attach-guardian";
import { useUpdateGuardianLink } from "@/features/user-management/guardian-management/api/update-guardian-links";
import { useSetPrimaryContact } from "@/features/user-management/guardian-management/api/set-primary";
import type { AttachGuardianPayload } from "@/features/user-management/guardian-management/types/attach-guardian-types";
import type { StudentGuardian } from "@/features/user-management/student-management/types/student-detail-types";

interface LinkGuardianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  // When set, the modal edits this existing link instead of creating
  // a new one.
  editingGuardian?: StudentGuardian;
}

interface LinkGuardianFormValues {
  guardianId: string;
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

const DEFAULT_VALUES: LinkGuardianFormValues = {
  guardianId: "",
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

function valuesFromLink(guardian: StudentGuardian): LinkGuardianFormValues {
  return {
    guardianId: guardian.id,
    relationship: guardian.link.relationship,
    isPrimaryContact: guardian.link.is_primary_contact,
    isEmergencyContact: guardian.link.is_emergency_contact,
    isFinanciallyResponsible: guardian.link.is_financially_responsible,
    authorisedToCollect: guardian.link.authorised_to_collect,
    receivesAcademicReports: guardian.link.receives_academic_reports,
    receivesMedicalInfo: guardian.link.receives_medical_info,
    canMakeDecisions: guardian.link.can_make_decisions,
    hasPortalAccess: guardian.link.has_portal_access,
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
// the real "Attach a guardian" spec.
const RESPONSIBILITY_ROWS: {
  name: keyof LinkGuardianFormValues;
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

interface GuardianOption {
  value: string;
  label: string;
}

/**
 * Local searchable combobox for the guardian field — the same pattern
 * as the student picker in LinkStudentModal. The typing is handed up
 * (onQueryChange) so the parent can search on the SERVER, since
 * GET /guardians is paginated and filtering only the fetched page
 * client-side would miss every guardian beyond it. `options` is
 * deliberately NOT filtered here.
 *
 * The chosen guardian's label is remembered locally, because the
 * options list changes with every search and the selected guardian may
 * not be in the current results.
 */
function SearchableGuardianSelect({
  options,
  value,
  onChange,
  onQueryChange,
  isSearching,
}: {
  options: GuardianOption[];
  value: string;
  onChange: (next: string) => void;
  onQueryChange: (query: string) => void;
  isSearching: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GuardianOption | undefined>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Derived, not synced: the remembered option only counts while it
  // still matches the form's current value, so a form reset (value
  // back to "") clears the label with no effect needed.
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

  function handleSelect(option: GuardianOption) {
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
          {selectedLabel ?? "Select guardian"}
        </span>
        <ArrowDown2 size={16} variant="Linear" color="currentColor" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-full overflow-hidden rounded-2xl border border-primary-100 bg-base-white shadow-lg">
          <input
            autoFocus
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Search by name, phone or email…"
            className="w-full border-b border-primary-100 px-4 py-3 text-[13px] outline-none"
          />
          <div className="max-h-60 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-[13px] text-neutrals-500">
                {isSearching
                  ? "Searching…"
                  : query
                    ? `No guardians match "${query}".`
                    : "No guardians found."}
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

/**
 * Two modes — the mirror of LinkStudentModal, on the same endpoints.
 * Here the student is fixed (the page's student) and the guardian is
 * picked; there it's the other way round.
 *
 * CREATE (no editingGuardian) — POST /students/{student}/guardians
 * with the guardian_id in the body. Linking with is_primary_contact
 * true demotes the student's current primary contact server-side.
 *
 * EDIT (editingGuardian set) — PUT /students/{student}/guardians/
 * {guardian} updates relationship + the seven non-primary flags. The
 * guardian is fixed (it's in the URL). is_primary_contact isn't
 * accepted by that endpoint, so turning it on goes through
 * POST .../set-primary instead. There's no "unset primary" endpoint,
 * so the toggle is locked on when this guardian is already primary.
 */
export default function LinkGuardianModal({
  open,
  onOpenChange,
  studentId,
  editingGuardian,
}: LinkGuardianModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!editingGuardian;

  // Server-side guardian search, debounced so it isn't one request per
  // keystroke.
  const [guardianQuery, setGuardianQuery] = useState("");
  const [debouncedGuardianQuery, setDebouncedGuardianQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedGuardianQuery(guardianQuery.trim()),
      300
    );
    return () => clearTimeout(timer);
  }, [guardianQuery]);

  const { data: guardians, isFetching: isSearchingGuardians } = useGetGuardians(
    { search: debouncedGuardianQuery || undefined }
  );
  const guardianOptions: GuardianOption[] = (guardians?.data ?? []).map(
    (guardian) => ({
      value: guardian.id,
      label: guardian.full_name,
    })
  );

  const methods = useForm<LinkGuardianFormValues>({
    defaultValues: editingGuardian
      ? valuesFromLink(editingGuardian)
      : DEFAULT_VALUES,
  });
  const { control, handleSubmit, reset, formState } = methods;

  const attachGuardianMutation = useAttachGuardian();
  const updateLinkMutation = useUpdateGuardianLink();
  const setPrimaryMutation = useSetPrimaryContact();

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      setGuardianQuery("");
    }
    onOpenChange(nextOpen);
  }

  function extractErrorMessage(error: unknown, fallback: string): string {
    return error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : fallback;
  }

  const onSubmit = async (values: LinkGuardianFormValues) => {
    if (!values.guardianId || !values.relationship) {
      toast.error("Select a guardian and their relationship to continue.");
      return;
    }

    if (isEdit && editingGuardian) {
      try {
        await updateLinkMutation.mutateAsync({
          studentId,
          guardianId: editingGuardian.id,
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
          !editingGuardian.link.is_primary_contact
        ) {
          await setPrimaryMutation.mutateAsync({
            studentId,
            guardianId: editingGuardian.id,
          });
        }

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["students", studentId] }),
          queryClient.invalidateQueries({
            queryKey: ["guardians", editingGuardian.id],
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
      guardian_id: values.guardianId,
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
      await attachGuardianMutation.mutateAsync({ studentId, payload });

      // The student's own view (["students", studentId] is a prefix
      // match, so it also covers its guardians list) plus the guardian
      // that was just linked.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["students", studentId] }),
        queryClient.invalidateQueries({
          queryKey: ["guardians", values.guardianId],
        }),
      ]);

      toast.success("Guardian linked successfully");
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to link guardian:", error);
      toast.error(
        extractErrorMessage(error, "Failed to link guardian. Please try again.")
      );
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? "Edit Link" : "Link Guardian"}
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
                {editingGuardian?.full_name}
              </div>
            ) : (
              <Controller
                name="guardianId"
                control={control}
                render={({ field }) => (
                  <SearchableGuardianSelect
                    options={guardianOptions}
                    value={field.value}
                    onChange={field.onChange}
                    onQueryChange={setGuardianQuery}
                    isSearching={isSearchingGuardians}
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
                    isEdit && !!editingGuardian?.link.is_primary_contact
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