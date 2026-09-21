"use client";

import { Text } from "@/components/ui";
import Header from "../_components/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import { SearchInput } from "@/components/ui/form/input";
import { Pagination, StatusBadge } from "@/components/common";
import AddStaff from "./_components/add-staff";
import { useProgressRouter } from "@/features/page-loader";
import { HEADROW } from "./constants";
import ImportStaff from "./_components/import-user";
import { useListStaff } from "@/features/user-management/staff-management/api/list-staff";
import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import { Spinner } from "@/components/animations";
import { titleCase } from "@/lib/helpers/string-to-title-case";

function StaffManagement() {
  const router = useProgressRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const exportStaff = () => alert("export clicked");
  const addStaff = () =>
    router.push(
      "/super-admin/user-management/staff-management?add-modal=true&current=1"
    );
  const importStaff = () =>
    router.push(
      "/super-admin/user-management/staff-management?import-modal=true&current=1"
    );
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const {
    data: allStaff,
    isRefetching,
    refetch,
    error,
    isPending,
  } = useListStaff({ search: searchKey, page: currentPage }, {});
  const hasStaff = allStaff && allStaff.data.length > 0;
  const metaData = allStaff?.meta;
  const onSearchInputChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>
  ) => {
    setSearchFilter(e.target.value);
  };

  useEffect(() => {
    if (searchFilter.length > 2) {
      setSearchKey(searchFilter);
    } else return;
  }, [searchFilter]);

  if (error) {
    return (
      <div className="w-fit mx-auto">
        {" "}
        <NoData
          variant="signal"
          title="Something went Wrong"
          subTitle={error.message || ""}
          className="w-97.5 h-143.75"
        />
        <Button
          className="mt-3 w-full"
          loading={isRefetching}
          onClick={() => refetch()}
          size="lg"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        role="staff"
        onExportClick={exportStaff}
        onAddClick={addStaff}
        onImportClick={importStaff}
      />

      <>
        <div className="rounded-tr-ml flex-1 overflow-auto">
          <div className="bg-white p-4 ">
            <Text
              className="block mb-8"
              weight={"standard"}
              scale={"highlight"}
            >
              Staff Management
            </Text>
            <div className="flex items-center gap-6">
              <SearchInput
                value={searchFilter}
                onChange={onSearchInputChange}
                placeholder="Search staff name"
                className="flex-1"
              />
              <Text scale={"caption"} className="text-neutrals-700">{`Showing ${
                metaData?.from ?? 0
              } - ${metaData?.to ?? 0} of ${metaData?.total ?? 0}`}</Text>
            </div>
          </div>

          {isPending ? (
            <div className="w-full flex items-center justify-center py-7">
              <Spinner size={70} />
            </div>
          ) : hasStaff ? (
            <Table className="m-0">
              <TableHeader className="[&>tr>th:first-child]:!rounded-none [&>tr>th:first-child]:!border-0 [&>tr>th:first-child]:!pl-4 [&>tr>th:last-child]:!rounded-none [&>tr>th:last-child]:!border-0 [&>tr>th:last-child]:!pr-4">
                <TableRow>
                  {HEADROW.map((col) => {
                    return (
                      <TableHead
                        className={clsx("text-neutrals-700")}
                        key={col}
                      >
                        {col}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>

              <TableBody>
                {allStaff.data.map((staff, index) => (
                  <TableRow
                    className="cursor-pointer"
                    key={index}
                    onClick={() =>
                      router.push(
                        `/super-admin/user-management/staff-management/${staff.id}/general`
                      )
                    }
                  >
                    <TableCell>{titleCase(staff.full_name) ?? "-"}</TableCell>
                    <TableCell>{staff.email ?? "-"}</TableCell>
                    <TableCell>{staff.staff_number ?? "-"}</TableCell>
                    <TableCell>{titleCase(staff.category) ?? "-"}</TableCell>
                    <TableCell>
                      {titleCase(staff.department || "") ?? "-"}
                    </TableCell>
                    <TableCell>
                      {titleCase(staff.contract_type || "") ?? "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        data={titleCase(staff.staff_status)}
                        variant={
                          staff.staff_status === "active" ? "green" : "orange"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <>
              {" "}
              <div className="w-fit mx-auto">
                {" "}
                <NoData
                  title="No Staff"
                  subTitle="You haven't added any staff yet, click the button above to make one"
                  className="w-97.5 h-143.75"
                />
              </div>
            </>
          )}
        </div>

        {hasStaff && (
          <div className="overflow-hidden rounded-b-ml">
            <Pagination
              currentPage={metaData?.current_page ?? currentPage}
              totalItems={metaData?.total ?? 0}
              pageSize={metaData?.per_page ?? 14}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </>

      <AddStaff />
      <ImportStaff />
    </div>
  );
}

export default function StaffManagementPage() {
  return (
    <Suspense fallback={null}>
      <StaffManagement />
    </Suspense>
  );
}
