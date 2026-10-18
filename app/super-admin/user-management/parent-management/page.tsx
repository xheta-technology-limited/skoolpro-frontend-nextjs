"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import Header from "../_components/header";
import Pagination from "@/components/common/pagination/pagination";
import ParentRow, { type Parent } from "./_components/ParentRow";
import AddParentModal from "./_components/AddGuardianModal";
import { useUserStore } from "@/features/school-profile/school-profile.store";
import ImportParent from "./_components/import-user";
import { useGetGuardians } from "@/features/user-management/guardian-management/api/get-guardians";
import type { GuardianRecord } from "@/features/user-management/guardian-management/types/guardian-types";
import { useProgressRouter } from "@/features/page-loader";
import SearchInput from "@/components/ui/form/input/search-input";

const TABLE_COLUMNS = [
  "Name",
  "Email address",
  "Occupation",
  "Children",
  "Phone no.",
  "Login",
];

const GRID_TEMPLATE = "grid-cols-[1.5fr_1.5fr_1.2fr_.8fr_1.2fr_.8fr]";

const PAGE_SIZE = 10;

function toParentRowData(record: GuardianRecord): Parent {
  return {
    id: record.id,
    name: record.full_name,
    email: record.email ?? "",
    occupation: record.occupation ?? "—",
    childrenCount:
      record.children_count !== undefined
        ? String(record.children_count)
        : "—",
    phone: record.phone ?? "",
    hasLogin: record.has_login,
  };
}

export default function ParentManagement() {
  const router = useProgressRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [isAddParentOpen, setIsAddParentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const schoolId = useUserStore((state) => state.data?.id) ?? "";

  const { data, isPending, isError, refetch } = useGetGuardians({
    search: searchTerm || undefined,
    page: currentPage,
    per_page: PAGE_SIZE,
  });

  const parents = useMemo(
    () => (data?.data ?? []).map(toParentRowData),
    [data]
  );

  const metaData = data?.meta;

  const totalItems = metaData?.total ?? 0;
  const rangeStart = metaData?.from ?? 0;
  const rangeEnd = metaData?.to ?? 0;

  const exportParent = () => alert("export clicked");
  const addParent = () => setIsAddParentOpen(true);
  const importParent = () =>
    router.push(
      "/super-admin/user-management/parent-management?import-modal=true&current=1"
    );

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  return (
    <>
      <Header
        role="parent"
        onExportClick={exportParent}
        onAddClick={addParent}
        onImportClick={importParent}
      />

      <AddParentModal
        open={isAddParentOpen}
        onOpenChange={setIsAddParentOpen}
        schoolId={schoolId}
      />

      <ImportParent />

      <div className="flex w-full flex-col gap-1">
        <section className="w-full rounded-t-2xl border border-primary-100 bg-[#FFFFFF] px-4 pt-4 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[16px] font-medium leading-6 text-neutrals-900">
              Parent Management
            </h1>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <SearchInput
              placeholder="Search name, email..."
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
              Loading parents…
            </span>
          </section>
        ) : isError ? (
          <section className="flex min-h-105 w-full flex-col items-center justify-center gap-4 bg-[#FFFFFF] sm:min-h-131.25">
            <span className="text-[13px] text-neutrals-500">
              Unable to load parents.
            </span>

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-primary px-6 py-2 text-[13px] text-white"
            >
              Retry
            </button>
          </section>
        ) : parents.length === 0 ? (
          <section className="flex min-h-105 w-full flex-col items-center justify-center bg-[#FFFFFF] px-4 py-10 sm:min-h-131.25">
            <Image
              src="/norecord.png"
              alt="No records here yet — add parents and they'll show up here"
              width={372}
              height={300}
              className="h-auto w-full max-w-93"
            />
          </section>
        ) : (
          <section className="w-full overflow-x-auto bg-[#FFFFFF]">
            <div className="min-w-190">
              {parents.map((parent) => (
                <ParentRow
                  key={parent.id}
                  parent={parent}
                  gridTemplate={GRID_TEMPLATE}
                  onClick={() =>
                    router.push(
                      `/super-admin/user-management/parent-management/${parent.id}/general`
                    )
                  }
                />
              ))}
            </div>
          </section>
        )}

        <Pagination
          currentPage={metaData?.current_page ?? currentPage}
          totalItems={metaData?.total ?? 0}
          pageSize={metaData?.per_page ?? PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}