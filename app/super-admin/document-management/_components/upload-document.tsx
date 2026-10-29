"use client";

import { useEffect } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { usePathname, useSearchParams } from "next/navigation";
import { AddSquare, DocumentUpload, TickSquare } from "iconsax-reactjs";
import { toast } from "sonner";
import { z } from "zod";

import { DatePicker, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useUserStore } from "@/features/school-profile/school-profile.store";
import { useUploadDocument } from "@/features/documents/api/upload-document";
import { useGetDocumentTypes } from "@/features/documents/types/get-document-types";
import type { DocumentConfidentiality } from "@/features/documents/types/document-types";
import { notifyError } from "./document-ui";


const CONFIDENTIALITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "restricted", label: "Restricted" },
  { value: "confidential", label: "Confidential" },
];

// The spec's file limit is 20 MB (per-purpose limits may be tighter —
// the server enforces those).
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// TODO: placeholder file types.
const DOCUMENT_ACCEPT = {
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

const uploadDocumentSchema = z.object({
  file: z.instanceof(File, { message: "Choose a file to upload" }),
  purpose: z.string().min(1, "Select a document type"),
  confidentiality: z.string().min(1, "Select confidentiality"),
  title: z.string().min(1, "Enter a document title"),
  expiry_date: z.string().optional(),
});

type UploadDocumentFormData = z.infer<typeof uploadDocumentSchema>;

const DEFAULT_VALUES: Partial<UploadDocumentFormData> = {
  file: undefined,
  purpose: "",
  confidentiality: "",
  title: "",
  expiry_date: "",
};

// "registration_certificate" -> "Registration certificate"
const humanise = (key: string) =>
  key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

// Local checkbox — the same tick-square (Bulk) look as the attendance
// status modal. Duplicated here; worth extracting to a shared component
// if a third place needs it.
function CheckboxField({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  // Display-only: the state comes from the selected document type's
  // rules, so there's no onChange and the button is disabled (without
  // the dimmed look, so the ticks stay readable).
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-readonly="true"
      disabled
      className="flex cursor-default items-center gap-2 text-left text-[14px] text-neutrals-900"
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

// Local drag-and-drop zone built on react-dropzone. Swap for a shared
// upload component if one already exists.
function FileDropzone({
  value,
  onChange,
  error,
}: {
  value: File | undefined;
  onChange: (file: File) => void;
  error?: string;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: DOCUMENT_ACCEPT,
    maxSize: MAX_FILE_SIZE,
    onDrop: (accepted) => {
      if (accepted[0]) onChange(accepted[0]);
    },
    onDropRejected: () =>
      toast.error("That file is too large (max 20 MB) or not a supported type."),
  });

  return (
    <div className="flex flex-col gap-1">
      <div
        {...getRootProps()}
        className={`flex h-32 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 text-center ${
          isDragActive
            ? "border-primary bg-primary-100"
            : "border-[#B8A9EE] bg-primary-bg"
        }`}
      >
        <input {...getInputProps()} />
        <DocumentUpload size={24} variant="Bulk" color="#7A6FE0" />
        {value ? (
          <span className="max-w-full truncate text-[14px] text-neutrals-900">
            {value.name}
          </span>
        ) : (
          <span className="text-[14px] text-neutrals-900">
            Drag and drop or{" "}
            <span className="font-medium text-primary">Browse</span> to upload
          </span>
        )}
      </div>
      {error && <span className="text-[12px] text-error">{error}</span>}
    </div>
  );
}

export default function UploadDocumentModal() {
  const router = useProgressRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("open") === "true";

  const schoolId = useUserStore((state) => state.data?.id) ?? "";
  const { mutateAsync: uploadDocument, isPending } = useUploadDocument();

  const methods = useForm<UploadDocumentFormData>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(uploadDocumentSchema),
  });
  const { control, handleSubmit, reset, setValue, watch, formState } = methods;

  const { data: documentTypes } = useGetDocumentTypes();
  const purposeOptions = Object.keys(documentTypes ?? {}).map((key) => ({
    value: key,
    label: humanise(key),
  }));

  // The selected type's rules drive the (read-only) requirement ticks.
  const selectedPurpose = useWatch({ control, name: "purpose" });
  const rules = selectedPurpose ? documentTypes?.[selectedPurpose] : undefined;
  const needsApproval = !!rules?.requires_approval;
  const needsSignature = !!rules?.requires_signature;
  // "Needs renewal" is read off `expires` (types that expire also carry
  // a renewal_lead_days). It also decides whether the expiry date field
  // is shown at all.
  const needsRenewal = !!rules?.expires;
  // Only claim "None" once a type is picked and nothing applies.
  const noRequirements =
    !!rules && !needsApproval && !needsSignature && !needsRenewal;

  // Choosing a type pre-selects its default confidentiality (still
  // editable). Only reacts to the type field changing.
  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name !== "purpose" || !values.purpose) return;
      const fallback = documentTypes?.[values.purpose]?.default_confidentiality;
      if (fallback) {
        setValue("confidentiality", fallback, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, documentTypes]);

  const handleClose = () => {
    reset();
    router.replace(pathname);
  };

  const onSubmit = async (data: UploadDocumentFormData) => {
    // Guard first: an empty id would build the URL
    // `documentables/school//documents`.
    if (!schoolId) {
      toast.error("Couldn't find your school. Please refresh and try again.");
      return;
    }

    try {
      await uploadDocument({
        type: "school",
        id: schoolId,
        payload: {
          file: data.file,
          purpose: data.purpose,
          title: data.title,
          confidentiality_level: data.confidentiality as DocumentConfidentiality,
          // The date picker's value is an ISO datetime; the API wants a
          // plain date. Only sent for types that expire — the field is
          // hidden otherwise, and a date typed before switching type
          // shouldn't go along.
          expiry_date:
            needsRenewal && data.expiry_date
              ? data.expiry_date.slice(0, 10)
              : undefined,
          // The requirement ticks aren't sent: they're derived from the
          // type's rules, which the backend already applies.
        },
      });
      toast.success("Document uploaded successfully");
      handleClose();
    } catch (error) {
      notifyError(error, "Failed to upload document. Please try again.");
    }
  };

  return (
    <FormModal
      title="Upload Document"
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
      maxWidth="max-w-144"
    >
      <FormProvider {...methods}>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <FileDropzone
                value={field.value}
                onChange={field.onChange}
                error={formState.errors.file?.message}
              />
            )}
          />

          <Select
            name="purpose"
            label="Select document type"
            options={purposeOptions}
          />
          <Select
            name="confidentiality"
            label="Select confidentiality"
            options={CONFIDENTIALITY_OPTIONS}
          />
          <Input name="title" label="Enter document title" />
          {needsRenewal && (
            <DatePicker name="expiry_date" label="Enter expiry date" />
          )}

          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-medium text-neutrals-900">
              Requirements
            </span>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <CheckboxField label="None" checked={noRequirements} />
              <CheckboxField label="Needs approval" checked={needsApproval} />
              <CheckboxField label="Needs signature" checked={needsSignature} />
              <CheckboxField label="Needs renewal" checked={needsRenewal} />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[28px] border border-primary bg-base-white px-8 py-4"
            >
              <span className="text-[16px] font-normal leading-[1.2] text-primary">
                Cancel
              </span>
            </button>

            <Button
              type="submit"
              loading={isPending}
              className="h-14 flex-1 rounded-[28px]"
            >
              Upload
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}

export function OpenModalButton() {
  const router = useProgressRouter();
  const pathname = usePathname();

  return (
    <Button
      size="lg"
      className="h-12 w-full gap-2 rounded-[28px] px-8 py-3.5 sm:w-auto sm:min-w-68.5"
      onClick={() => router.push(`${pathname}?open=true`)}
    >
      <AddSquare variant="Bulk" size={20} />
      <span>Upload Document</span>
    </Button>
  );
}