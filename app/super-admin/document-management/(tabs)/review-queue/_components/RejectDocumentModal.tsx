"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import FormModal from "@/components/ui/form-modal";
import { useRejectDocument } from "@/features/documents/api/reject-document";
import type { DocumentRecord } from "@/features/documents/types/document-types";
import { notifyError } from "../../../_components/document-ui";

// The design's counter. (The API itself allows up to 500.)
const MAX_REASON_LENGTH = 200;

interface RejectDocumentModalProps {
  // The document being rejected; the modal is open while this is set.
  doc: DocumentRecord | undefined;
  onClose: () => void;
  // Called after a successful reject, e.g. so the review modal behind
  // this one can close too.
  onRejected?: () => void;
}

interface RejectFormValues {
  reason: string;
}

export default function RejectDocumentModal({
  doc,
  onClose,
  onRejected,
}: RejectDocumentModalProps) {
  const { register, handleSubmit, reset, setError, watch, formState } =
    useForm<RejectFormValues>({ defaultValues: { reason: "" } });
  const rejectMutation = useRejectDocument();

  const reasonLength = watch("reason").length;

  function handleClose() {
    reset();
    onClose();
  }

  const onSubmit = async (values: RejectFormValues) => {
    if (!doc) return;
    const reason = values.reason.trim();
    if (!reason) {
      setError("reason", { message: "Tell the uploader what to fix" });
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        documentId: doc.id,
        payload: { reason },
      });
      toast.success("Document rejected");
      reset();
      onRejected?.();
      onClose();
    } catch (error) {
      notifyError(error, "Failed to reject document.");
    }
  };

  return (
    <FormModal
      open={!!doc}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
      title="Reject Document"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <div className="flex flex-col gap-3">
          <label
            htmlFor="reject-reason"
            className="text-[14px] font-medium text-neutrals-700"
          >
            Reason
          </label>

          <div className="flex flex-col gap-1">
            <textarea
              id="reject-reason"
              maxLength={MAX_REASON_LENGTH}
              placeholder="Tell the uploader what to fix"
              className="h-29.5 w-full resize-y rounded-[8px] bg-primary-bg p-4 text-[14px] text-neutrals-900 outline-none placeholder:text-neutrals-400"
              {...register("reason")}
            />
            <div className="flex items-start justify-between gap-4">
              <span className="text-[12px] text-error">
                {formState.errors.reason?.message}
              </span>
              <span className="text-[12px] text-neutrals-400">
                {reasonLength}/{MAX_REASON_LENGTH}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-14 flex-1 items-center justify-center rounded-[28px] border border-primary bg-base-white px-8 py-4"
          >
            <span className="text-[16px] font-normal leading-[1.2] text-primary">
              Cancel
            </span>
          </button>

          <button
            type="submit"
            disabled={rejectMutation.isPending}
            className="flex h-14 flex-1 items-center justify-center rounded-[28px] bg-error-300 px-8 py-4 disabled:opacity-70"
          >
            <span className="text-[16px] font-normal leading-[1.2] text-white">
              {rejectMutation.isPending ? "Rejecting…" : "Reject"}
            </span>
          </button>
        </div>
      </form>
    </FormModal>
  );
}