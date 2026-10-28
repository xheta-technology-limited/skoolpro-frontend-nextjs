"use client";

import { useState } from "react";
import { DocumentDownload, Refresh } from "iconsax-reactjs";

import FormModal from "@/components/ui/form-modal";
import { openDocumentDownload } from "@/features/documents/api/download-document";
import { useGetDocumentSignatures } from "@/features/documents/api/get-document-signatures";
import type { DocumentRecord } from "@/features/documents/types/document-types";
import ReviewTimeline from "../../../_components/ReviewTimeline";
import {
  InfoPair,
  StatusBadge,
  formatDate,
  humanise,
  titleCase,
} from "../../../_components/document-ui";
import RenewDocumentModal from "./RenewDocumentModal";
import SignaturesModal from "./SignaturesModal";

interface DocumentDetailModalProps {
  // The document to show; the modal is open while this is set.
  doc: DocumentRecord | undefined;
  onClose: () => void;
}

/**
 * Details for one document, opened from the "Open" button on a row.
 * No `maxWidth` override: FormModal's default (701px) leaves exactly
 * the 653px content width the design uses.
 *
 * Everything here is real:
 *  - Download opens GET /documents/{id}/download.
 *  - The timeline is the document's review history (without reviewer
 *    names — review rows only carry an actor id).
 *  - The Signature row's View lists the signatures and runs the tamper
 *    check. The signature image itself can't be shown: it's stored
 *    privately and no endpoint serves it.
 *  - Renew opens a replacement-upload modal (no design was shared for
 *    it, so it reuses the upload modal's look).
 *  - "Last updated" is created_at; there's no updated_at.
 */
export default function DocumentDetailModal({
  doc,
  onClose,
}: DocumentDetailModalProps) {
  const [viewingSignatures, setViewingSignatures] = useState(false);
  const [renewing, setRenewing] = useState(false);

  const { data: signatures } = useGetDocumentSignatures(doc?.id ?? "");
  const activeCount = (signatures ?? []).filter((s) => !s.voided).length;

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
            className="flex h-8 items-center gap-2 rounded-[28px] border border-primary bg-base-white px-5 text-[14px] font-normal text-primary"
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
              right={["Last updated", formatDate(doc.created_at)]}
            />

            <ReviewTimeline doc={doc} />

            {/* Signature row: 58px tall = 8px padding around a 42px row,
                16px radius, #F5F5FF like the field boxes. */}
            <div className="flex h-14.5 items-center rounded-ml bg-primary-bg p-2">
              <div className="flex h-full w-full items-center justify-between rounded-[8px] border border-grays-borders bg-white px-3">
                <span className="text-[14px] text-neutrals-900">
                  Signature
                  {activeCount > 0 && (
                    <span className="ml-2 text-[12px] text-neutrals-500">
                      {activeCount} signed
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setViewingSignatures(true)}
                  disabled={(signatures ?? []).length === 0}
                  title={
                    (signatures ?? []).length === 0
                      ? "Nobody has signed this document yet"
                      : undefined
                  }
                  className="rounded-full border border-grays-borders px-3 py-0.5 text-[12px] text-neutrals-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  View
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRenewing(true)}
              className="flex h-8 w-fit items-center gap-2 rounded-[28px] border border-primary bg-base-white px-6 text-[14px] text-primary"
            >
              Renew
              <Refresh size={16} variant="Bulk" color="#010081" />
            </button>
          </div>
        )}
      </FormModal>

      <SignaturesModal
        open={viewingSignatures}
        onOpenChange={setViewingSignatures}
        documentId={doc?.id ?? ""}
      />

      {doc && (
        <RenewDocumentModal
          key={doc.id}
          open={renewing}
          onOpenChange={setRenewing}
          doc={doc}
        />
      )}
    </>
  );
}