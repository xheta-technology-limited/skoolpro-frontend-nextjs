"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import Pagination from "@/components/common/pagination/pagination";
import SearchInput from "@/components/ui/form/input/search-input";
import { useGetReviewQueue } from "@/features/documents/api/get-review-queue";
import { useClaimDocument } from "@/features/documents/api/claim-document";
import type { DocumentRecord } from "@/features/documents/types/document-types";
import { StatusBadge, notifyError } from "../../_components/document-ui";
import RejectDocumentModal from "./_components/RejectDocumentModal";
import ReviewDetailModal from "./_components/ReviewDetailModal";

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under review" },
] as const;

type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number]["value"];

const TABLE_COLUMNS = ["Document", "Owner", "Status", "Waiting", "Action"];

const GRID_TEMPLATE = "grid-cols-[1.6fr_1.2fr_1fr_.8fr_1.6fr]";

const PAGE_SIZE = 10;

const ACTION_BUTTON =
  "h-6.5 rounded-full border px-3 text-[12px] font-normal leading-none";

// Whole days since the document was submitted.
const daysWaiting = (createdAt: string) =>
  Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000));

export default function ReviewQueuePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | undefined>();
  const [rejectingDoc, setRejectingDoc] = useState<
    DocumentRecord | undefined
  >();

  const { data, isPending, isError, refetch } = useGetReviewQueue({
    page: currentPage,
    per_page: PAGE_SIZE,
    verification_status: statusFilter === "all" ? undefined : statusFilter,
    title: searchTerm.trim() || undefined,
  });

  const { mutate: claim, isPending: isClaiming, variables } =
    useClaimDocument();
  const claimingId = isClaiming ? variables?.documentId : undefined;

  const rows = data?.data ?? [];
  const metaData = data?.meta;
  const totalItems = metaData?.total ?? 0;
  const rangeStart = metaData?.from ?? 0;
  const rangeEnd = metaData?.to ?? 0;

  function handleClaim(doc: DocumentRecord) {
    claim(
      { documentId: doc.id },
      {
        onSuccess: () => toast.success("Document claimed"),
        onError: (error) => notifyError(error, "Failed to claim document."),
      }
    );
  }

  return (
    <div className="flex w-full flex-col gap-1 overflow-hidden rounded-ml bg-primary-bg">
      <section className="w-full bg-[#FFFFFF] px-4 pt-4 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[18px] leading-6 text-neutrals-900">
            Review queue
          </h1>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              setCurrentPage(1);
            }}
            className="h-7 rounded-full border border-grays-borders bg-white px-3 text-[12px] text-neutrals-700 outline-none"
          >
            {STATUS_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <SearchInput
            placeholder="Search name..."
            className="flex-1"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          <span className="shrink-0 text-[12px] text-neutrals-700 sm:whitespace-nowrap">
            Showing {rangeStart} – {rangeEnd} of {totalItems}
          </span>
        </div>

        <div className="mt-5 w-full overflow-x-auto">
          <div
            className={`grid ${GRID_TEMPLATE} min-w-190 items-center pb-3 text-[12px] font-semibold text-neutrals-700`}
          >
            {TABLE_COLUMNS.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
        </div>
      </section>

      {isPending ? (
        <section className="flex min-h-105 w-full items-center justify-center bg-[#FFFFFF] sm:min-h-131.25">
          <span className="text-[13px] text-neutrals-500">
            Loading the review queue…
          </span>
        </section>
      ) : isError ? (
        <section className="flex min-h-105 w-full flex-col items-center justify-center gap-4 bg-[#FFFFFF] sm:min-h-131.25">
          <span className="text-[13px] text-neutrals-500">
            Unable to load the review queue.
          </span>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-primary px-6 py-2 text-[13px] text-white"
          >
            Retry
          </button>
        </section>
      ) : rows.length === 0 ? (
        <section className="flex min-h-105 w-full flex-col items-center justify-center bg-[#FFFFFF] px-4 py-10 sm:min-h-131.25">
          <Image
            src="/norecord.png"
            alt="Nothing to review right now"
            width={372}
            height={300}
            className="h-auto w-full max-w-93"
          />
        </section>
      ) : (
        <section className="w-full overflow-x-auto bg-[#FFFFFF]">
          <div className="min-w-190">
            {rows.map((doc) => {
              const claimable = doc.verification_status === "pending";

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`grid ${GRID_TEMPLATE} cursor-pointer items-center border-b border-neutrals-100 px-4 py-3 text-[13px] text-neutrals-900 last:border-b-0 sm:px-5 lg:px-6`}
                >
                  <span className="truncate pr-2">
                    {doc.title || doc.original_filename}
                  </span>
                  <span className="truncate pr-2">{doc.documentable_type}</span>
                  <span>
                    <StatusBadge status={doc.verification_status} />
                  </span>
                  <span>{daysWaiting(doc.created_at)}d</span>
                  <span className="flex items-center gap-2">
                    {/* Only pending documents can be claimed. The
                        invisible copy keeps Approve / Reject lined up
                        across rows. */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClaim(doc);
                      }}
                      disabled={!claimable || claimingId === doc.id}
                      aria-hidden={!claimable}
                      tabIndex={claimable ? 0 : -1}
                      className={`${ACTION_BUTTON} border-grays-borders text-neutrals-700 disabled:opacity-60 ${
                        claimable ? "" : "invisible"
                      }`}
                    >
                      {claimingId === doc.id ? "Claiming…" : "Claim"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoc(doc);
                      }}
                      className={`${ACTION_BUTTON} border-primary text-primary`}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRejectingDoc(doc);
                      }}
                      className={`${ACTION_BUTTON} border-[#E5484D] text-[#D92D20]`}
                    >
                      Reject
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Pagination
        currentPage={metaData?.current_page ?? currentPage}
        totalItems={totalItems}
        pageSize={metaData?.per_page ?? PAGE_SIZE}
        onPageChange={setCurrentPage}
      />

      <ReviewDetailModal
        doc={selectedDoc}
        onClose={() => setSelectedDoc(undefined)}
      />

      <RejectDocumentModal
        doc={rejectingDoc}
        onClose={() => setRejectingDoc(undefined)}
      />
    </div>
  );
}