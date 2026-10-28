"use client";

import { useState } from "react";
import { toast } from "sonner";

import FormModal from "@/components/ui/form-modal";
import { Button } from "@/components/ui/custom-button";
import { useGetDocumentSignatures } from "@/features/documents/api/get-document-signatures";
import { useVerifySignature } from "@/features/documents/api/verify-signature";
import { useVoidSignature } from "@/features/documents/api/void-signature";
import type {
  DocumentSignature,
  SignatureMethod,
} from "@/features/documents/types/document-types";
import { formatDate } from "../../../_components/document-ui";

interface SignaturesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
}

const METHOD_LABELS: Record<SignatureMethod, string> = {
  typed: "Typed",
  drawn: "Drawn",
  uploaded: "Uploaded",
  click_to_sign: "Click to sign",
};

function Pill({
  label,
  bg,
  text,
}: {
  label: string;
  bg: string;
  text: string;
}) {
  return (
    <span
      className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-normal"
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}

function IntegrityPill({
  documentId,
  signatureId,
}: {
  documentId: string;
  signatureId: string;
}) {
  const { data, isPending, isError } = useVerifySignature(
    documentId,
    signatureId
  );

  if (isPending) {
    return <Pill label="Checking…" bg="#E5E5E5" text="#6B6B6B" />;
  }

  if (isError || !data) {
    return <Pill label="Couldn't verify" bg="#E5E5E5" text="#6B6B6B" />;
  }

  return data.intact ? (
    <Pill label="Intact" bg="#DDF5EE" text="#0B7B69" />
  ) : (
    <Pill label="Changed since signing" bg="#FBE0E3" text="#8C1823" />
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[12px] text-neutrals-500">{label}</span>
      <span className="text-[14px] text-neutrals-900">{value}</span>
    </div>
  );
}

function SignatureCard({
  documentId,
  signature,
}: {
  documentId: string;
  signature: DocumentSignature;
}) {
  const [showVoidForm, setShowVoidForm] = useState(false);
  const [reason, setReason] = useState("");

  const voidMutation = useVoidSignature();

  const handleVoid = async () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      toast.error("Please provide a reason for voiding this signature.");
      return;
    }

    try {
      await voidMutation.mutateAsync({
        documentId,
        signatureId: signature.id,
        payload: { reason: trimmedReason },
      });

      toast.success("Signature voided successfully.");
      setShowVoidForm(false);
      setReason("");
    } catch {
      toast.error("Failed to void signature.");
    }
  };

  return (
    <div className="rounded-ml bg-primary-bg p-2">
      <div className="flex flex-col gap-3 rounded-[8px] border border-grays-borders bg-white p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[16px] text-neutrals-900">
              {signature.signer_name}
            </span>

            {signature.signer_capacity && (
              <span className="truncate text-[13px] text-neutrals-500">
                {signature.signer_capacity}
              </span>
            )}
          </div>

          {signature.voided ? (
            <Pill label="Voided" bg="#FBE0E3" text="#8C1823" />
          ) : (
            <IntegrityPill
              documentId={documentId}
              signatureId={signature.id}
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Detail label="Method" value={METHOD_LABELS[signature.method]} />
          <Detail label="Signed" value={formatDate(signature.signed_at)} />

          {signature.statement && (
            <div className="sm:col-span-2">
              <Detail label="Statement" value={signature.statement} />
            </div>
          )}

          {signature.voided && (
            <div className="sm:col-span-2">
              <Detail
                label="Voided"
                value={`${
                  signature.voided_at ? formatDate(signature.voided_at) : ""
                }${signature.void_reason ? ` · ${signature.void_reason}` : ""}`}
              />
            </div>
          )}

          {signature.has_image && (
            <div className="sm:col-span-2">
              <Detail label="Image" value="On file" />
            </div>
          )}
        </div>

        {!signature.voided && (
          <div className="border-t border-grays-borders pt-3">
            {!showVoidForm ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowVoidForm(true)}
                className="h-10 rounded-[28px] border border-error-200 px-4 text-error-200"
              >
                Void signature
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <label
                  htmlFor={`void-reason-${signature.id}`}
                  className="text-[13px] text-neutrals-700"
                >
                  Reason for voiding
                </label>

                <textarea
                  id={`void-reason-${signature.id}`}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Enter the reason for voiding this signature"
                  className="w-full resize-y rounded-[12px] border border-[#E5E5E5] p-3 text-[14px] outline-none focus:border-primary"
                />

                <span className="text-right text-[12px] text-neutrals-500">
                  {reason.length}/500
                </span>

                <p className="text-[12px] text-error-200">
                  Voiding a signature is permanent. It will no longer satisfy
                  a signature requirement.
                </p>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowVoidForm(false);
                      setReason("");
                    }}
                    disabled={voidMutation.isPending}
                    className="h-10 flex-1 rounded-[28px]"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    onClick={handleVoid}
                    loading={voidMutation.isPending}
                    disabled={
                      !reason.trim() ||
                      reason.trim().length > 500 ||
                      voidMutation.isPending
                    }
                    className="h-10 flex-1 rounded-[28px]"
                  >
                    Confirm void
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignaturesModal({
  open,
  onOpenChange,
  documentId,
}: SignaturesModalProps) {
  const {
    data: signatures,
    isPending,
    isError,
    refetch,
    isFetching,
  } = useGetDocumentSignatures(documentId);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Signatures"
      maxWidth="max-w-144"
    >
      <div className="flex w-full flex-col gap-4">
        {isPending ? (
          <span className="text-[13px] text-neutrals-500">Loading…</span>
        ) : isError || !signatures ? (
          <div className="flex flex-col items-start gap-3">
            <span className="text-[13px] text-neutrals-500">
              Couldn&apos;t load the signatures.
            </span>

            <Button
              type="button"
              variant="secondary"
              onClick={() => void refetch()}
              loading={isFetching}
              disabled={isFetching}
              className="h-10 rounded-[28px]"
            >
              Retry
            </Button>
          </div>
        ) : signatures.length === 0 ? (
          <span className="text-[13px] text-neutrals-500">
            Nobody has signed this document yet.
          </span>
        ) : (
          signatures.map((signature) => (
            <SignatureCard
              key={signature.id}
              documentId={documentId}
              signature={signature}
            />
          ))
        )}
      </div>
    </FormModal>
  );
}