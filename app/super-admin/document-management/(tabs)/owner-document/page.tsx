"use client";

import { useState } from "react";
import Image from "next/image";
import { DocumentDownload } from "iconsax-reactjs";

import Pagination from "@/components/common/pagination/pagination";
import SearchInput from "@/components/ui/form/input/search-input";
import { useUserStore } from "@/features/school-profile/school-profile.store";
import { useGetDocuments } from "@/features/documents/api/get-documents";
import { openDocumentDownload } from "@/features/documents/api/download-document";
import type { DocumentRecord } from "@/features/documents/types/document-types";

import DocumentDetailModal from "./_components/DocumentDetailModal";
import { StatusBadge, formatDate, titleCase } from "../../_components/document-ui";

const TABLE_COLUMNS = [
  "Document",
  "Confidentiality",
  "Status",
  "Expiry",
  "Updated",
  "Action",
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under review" },
  { value: "rejected", label: "Rejected"},
  { value: "not_required", label: "Not required"},
  { value: "verified", label: "Verified"},
  { value: "expired", label: "Expired"},
  { value: "superseded", label: "Superseded"},
] as const;

const GRID_TEMPLATE = "grid-cols-[1.5fr_1.2fr_1fr_1fr_1fr_1.2fr]";

const PAGE_SIZE = 10;

type StatusFilter = (typeof STATUS_FILTER_OPTIONS)[number]["value"];


export default function OwnerDocumentPage() {
  const schoolId = useUserStore((state) => state.data?.id) ?? "";

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<
    DocumentRecord | undefined
  >();

  const { data, isPending, isError, refetch } = useGetDocuments(
    "school",
    schoolId,
    {
      title: searchTerm.trim() || undefined,
      page: currentPage,
      verification_status: statusFilter === "all" ? undefined : statusFilter,
      per_page: PAGE_SIZE,
    }
  );

  const pageItems = data?.data ?? [];
  const metaData = data?.meta;

  const totalItems = metaData?.total ?? 0;
  const rangeStart = metaData?.from ?? 0;
  const rangeEnd = metaData?.to ?? 0;

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  return (
    <div className="flex w-full flex-col gap-1 overflow-hidden rounded-ml bg-primary-bg">
      <section className="w-full bg-[#FFFFFF] px-4 pt-4 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[18px] leading-6 text-neutrals-900">
            Owner Document
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
            onChange={(e) => handleSearchChange(e.target.value)}
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
            Loading documents…
          </span>
        </section>
      ) : isError ? (
        <section className="flex min-h-105 w-full flex-col items-center justify-center gap-4 bg-[#FFFFFF] sm:min-h-131.25">
          <span className="text-[13px] text-neutrals-500">
            Unable to load documents.
          </span>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-full bg-primary px-6 py-2 text-[13px] text-white"
          >
            Retry
          </button>
        </section>
      ) : pageItems.length === 0 ? (
        <section className="flex min-h-105 w-full flex-col items-center justify-center bg-[#FFFFFF] px-4 py-10 sm:min-h-131.25">
          <Image
            src="/norecord.png"
            alt="No records here yet — uploaded documents will show up here"
            width={372}
            height={300}
            className="h-auto w-full max-w-93"
          />
        </section>
      ) : (
        <section className="w-full overflow-x-auto bg-[#FFFFFF]">
          <div className="min-w-190">
            {pageItems.map((doc) => {
              const expired = doc.is_expired;

              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`grid ${GRID_TEMPLATE} cursor-pointer items-center border-b border-neutrals-100 px-4 py-3 text-[13px] text-neutrals-900 sm:px-5 lg:px-6`}
                >
                  <span className="truncate pr-2">{doc.title || doc.original_filename}</span>
                  <span className="truncate pr-2">
                    {doc.confidentiality_level ? titleCase(doc.confidentiality_level) : "—"}
                  </span>
                  <span>
                    <StatusBadge status={doc.verification_status} />
                  </span>
                  <span
                    className="truncate pr-2"
                    style={expired ? { color: "#D92D20" } : undefined}
                  >
                    {doc.expiry_date ? formatDate(doc.expiry_date) : "Nil"}
                  </span>
                  <span className="truncate pr-2">
                    {formatDate(doc.created_at)}
                  </span>
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Download document"
                      onClick={(e) => {
                        // Downloading shouldn't also open the details.
                        e.stopPropagation();
                        openDocumentDownload(doc.id);
                      }}
                    >
                      <DocumentDownload
                        size={20}
                        variant="Bulk"
                        color="#5a5555"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDocument(doc)}
                      className="rounded-xl border border-grays-borders px-3 py-0.5 text-[12px] text-neutrals-700"
                    >
                      Open
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

      <DocumentDetailModal
        doc={selectedDocument}
        onClose={() => setSelectedDocument(undefined)}
      />
    </div>
  );
}