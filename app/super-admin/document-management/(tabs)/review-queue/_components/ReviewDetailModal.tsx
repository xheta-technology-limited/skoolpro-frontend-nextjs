"use client";

import { useState } from "react";
import { DocumentDownload, Edit, TickSquare } from "iconsax-reactjs";
import { toast } from "sonner";

import FormModal from "@/components/ui/form-modal";
import { openDocumentDownload } from "@/features/documents/api/download-document";
import { useApproveDocument } from "@/features/documents/api/approve-document";
import { useGetDocumentSignatures } from "@/features/documents/api/get-document-signatures";
import { useGetDocumentTypes } from "@/features/documents/types/get-document-types";
import type { DocumentRecord } from "@/features/documents/types/document-types";
import ReviewTimeline from "../../../_components/ReviewTimeline";
import {
  InfoPair,
  InfoSingle,
  StatusBadge,
  formatDate,
  humanise,
  notifyError,
  titleCase,
} from "../../../_components/document-ui";
import CaptureSignatureModal from "./CaptureSignature";
import RejectDocumentModal from "./RejectDocumentModal";

interface ReviewDetailModalProps {
  // The document to review; the modal is open while this is set.
  doc: DocumentRecord | undefined;
  onClose: () => void;
}

const BUTTON =
  "flex h-8 items-center gap-2 rounded-[28px] border px-5 text-[14px] font-normal disabled:cursor-not-allowed disabled:opacity-70";

export default function ReviewDetailModal({
  doc,
  onClose,
}: ReviewDetailModalProps) {
  const [signing, setSigning] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const approveMutation = useApproveDocument();
  const { data: documentTypes } = useGetDocumentTypes();
  const { data: signatures } = useGetDocumentSignatures(doc?.id ?? "");

  const reviewable =
    doc?.verification_status === "pending" ||
    doc?.verification_status === "under_review";

  const requiresSignature =
    !!doc && !!documentTypes?.[doc.purpose]?.requires_signature;
  const activeSignatures = (signatures ?? []).filter((s) => !s.voided);
  const signatureValue =
    activeSignatures.length > 0
      ? `Signed — ${activeSignatures.map((s) => s.signer_name).join(", ")}`
      : requiresSignature
        ? "Required"
        : "Not required";

  async function handleApprove() {
    if (!doc) return;
    try {
      await approveMutation.mutateAsync({ documentId: doc.id });
      toast.success("Document approved");
      onClose();
    } catch (error) {
      // e.g. 422 when the type needs a signature and none exists yet.
      notifyError(error, "Failed to approve document.");
    }
  }

  return (
    <>
      <FormModal
        open={!!doc}
        onOpenChange={(next) => {
          if (!next) onClose();
        }}
        title={
          <span className="flex flex-col items-start gap-1">
            <span>{doc?.title || doc?.original_filename}</span>
            {doc && <StatusBadge status={doc.verification_status} />}
          </span>
        }
        icon={
          <button
            type="button"
            onClick={() => doc && openDocumentDownload(doc.id)}
            className={`${BUTTON} border-primary bg-base-white text-primary`}
          >
            Download document
            <DocumentDownload size={18} variant="Bulk" color="#010081" />
          </button>
        }
      >
        {doc && (
          <div className="flex w-full flex-col gap-4">
            <InfoPair
              left={["Purpose", humanise(doc.purpose)]}
              right={["Owner", doc.documentable_type]}
            />
            <InfoPair
              left={[
                "Source",
                doc.source === "uploaded" ? "Upload" : titleCase(doc.source),
              ]}
              right={["Confidentiality", titleCase(doc.confidentiality_level)]}
            />
            <InfoPair
              left={[
                "Expiry",
                doc.expiry_date ? formatDate(doc.expiry_date) : "Nil",
              ]}
              right={["Submitted", formatDate(doc.created_at)]}
            />

            <ReviewTimeline doc={doc} />

            <InfoSingle field={["Signature", signatureValue]} />

            {reviewable && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  className={`${BUTTON} border-primary bg-base-white text-primary`}
                >
                  <TickSquare size={16} variant="Bulk" color="#010081" />
                  {approveMutation.isPending ? "Approving…" : "Approve"}
                </button>
                <button
                  type="button"
                  onClick={() => setRejecting(true)}
                  className={`${BUTTON} border-[#E5484D] bg-base-white text-[#D92D20]`}
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setSigning(true)}
                  className={`${BUTTON} border-neutrals-800 bg-base-white text-neutrals-800`}
                >
                  <Edit size={16} variant="Bulk" color="#5a5555" />
                  Sign
                </button>
              </div>
            )}
          </div>
        )}
      </FormModal>

      <CaptureSignatureModal
        open={signing}
        onOpenChange={setSigning}
        documentId={doc?.id ?? ""}
      />

      <RejectDocumentModal
        doc={rejecting ? doc : undefined}
        onClose={() => setRejecting(false)}
        onRejected={onClose}
      />
    </>
  );
}