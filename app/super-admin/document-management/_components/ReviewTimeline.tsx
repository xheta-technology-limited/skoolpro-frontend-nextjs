"use client";

import { useGetDocumentReviews } from "@/features/documents/api/get-document-reviews";
import type {
  DocumentRecord,
  DocumentReviewAction,
  DocumentVerificationStatus,
} from "@/features/documents/types/document-types";
import { TimelineStep, formatDate } from "./document-ui";

const ACTION_LABELS: Record<DocumentReviewAction, string> = {
  submitted: "Submitted",
  claim: "Claimed",
  release: "Released",
  approve: "Approved",
  reject: "Rejected",
  expire: "Expired",
  supersede: "Superseded",
};

// Steps still to come for a document in an open state, shown as hollow
// markers like the design.
const REMAINING_STEPS: Partial<Record<DocumentVerificationStatus, string[]>> = {
  pending: ["Claimed", "Approved"],
  under_review: ["Approved"],
};

/**
 * A document's review timeline, from GET /documents/{id}/reviews: every
 * recorded action (oldest first) with its date and note.
 *
 * GAP (for the backend): review rows only carry `actor_id`, with no
 * name, so the design's "Amara O. A." isn't shown — only the date.
 *
 * If the history can't be loaded (e.g. the viewer lacks
 * documents.review), it falls back to the two steps the document itself
 * records: submitted (created_at) and verified (verified_at).
 */
export default function ReviewTimeline({ doc }: { doc: DocumentRecord }) {
  const { data: reviews, isPending, isError } = useGetDocumentReviews(doc.id);

  // The hollow "still to come" steps follow the document's CURRENT
  // status, taken from the newest history row. That row is always at
  // least as fresh as the `doc` the modal was opened with, which can be
  // stale right after an approve — and it's what stops an approved
  // document (even one approved without ever being claimed) from showing
  // an empty "Approved" step after the real one.
  const currentStatus = reviews?.[0]?.to_status ?? doc.verification_status;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[16px] font-medium text-neutrals-700">
        Review timeline
      </span>

      {isPending ? (
        <span className="text-[13px] text-neutrals-500">Loading…</span>
      ) : isError || !reviews ? (
        <>
          <TimelineStep label="Submitted" date={formatDate(doc.created_at)} />
          {doc.verified_at && (
            <TimelineStep
              label="Verified"
              date={formatDate(doc.verified_at)}
            />
          )}
        </>
      ) : (
        <>
          {/* The API returns newest first; a timeline reads oldest first. */}
          {[...reviews].reverse().map((review) => (
            <TimelineStep
              key={review.id}
              label={ACTION_LABELS[review.action] ?? review.action}
              date={`${formatDate(review.created_at)}${
                review.note ? ` · ${review.note}` : ""
              }`}
            />
          ))}
          {(REMAINING_STEPS[currentStatus] ?? []).map((label) => (
            <TimelineStep key={label} label={label} done={false} />
          ))}
        </>
      )}
    </div>
  );
}