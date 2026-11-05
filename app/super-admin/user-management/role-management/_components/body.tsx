"use client";
import { Spinner } from "@/components/animations";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import { Text } from "@/components/ui";
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
import { useSearchParams } from "next/navigation";
import { useListStaff } from "@/features/user-management/staff-management/api/list-staff";
import { ChangeEvent, Suspense, useEffect, useRef, useState } from "react";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import { useListRoles } from "@/features/role-management/api/list-roles";
import AddRole from "./add-role";

const HEADROW = ["Role Name", "Permissions", "Date Created", "Action"];

export default function Body() {
  const router = useProgressRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const {
    data: allRoles,
    isRefetching,
    refetch,
    error,
    isPending,
  } = useListRoles();
  const hasRoles = allRoles && allRoles.length > 0;
  //   const metaData = allRoles?.meta;
  const onSearchInputChange = (
    e: ChangeEvent<HTMLInputElement, HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSearchFilter(value);
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      setSearchKey(value.length > 2 ? value : "");
      if (value.length <= 2) {
        setCurrentPage(1);
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-fit mx-auto">
        <AddRole />{" "}
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
    <>
      <AddRole />
      <div className="rounded-tr-ml flex-1 overflow-auto">
        <div className="bg-white p-4 rounded-t-ml">
          <div className="flex items-center gap-6">
            <SearchInput
              value={searchFilter}
              onChange={onSearchInputChange}
              placeholder="Search staff name"
              className="flex-1"
            />
            {/* <Text scale={"caption"} className="text-neutrals-700">{`Showing ${
              metaData?.from ?? 0
            } - ${metaData?.to ?? 0} of ${metaData?.total ?? 0}`}</Text> */}
          </div>
        </div>

        {isPending ? (
          <div className="w-full flex items-center justify-center py-7">
            <Spinner size={70} />
          </div>
        ) : hasRoles ? (
          <Table className="m-0">
            <TableHeader className="[&>tr>th:first-child]:!rounded-none [&>tr>th:first-child]:!border-0 [&>tr>th:first-child]:!pl-4 [&>tr>th:last-child]:!rounded-none [&>tr>th:last-child]:!border-0 [&>tr>th:last-child]:!pr-4">
              <TableRow>
                {HEADROW.map((col) => {
                  return (
                    <TableHead className={clsx("text-neutrals-700")} key={col}>
                      {col}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {allRoles.map((r, index) => {
                const date = new Date(r.created_at).toLocaleDateString();
                return (
                  <TableRow key={index}>
                    <TableCell>{titleCase(r.label) ?? "-"}</TableCell>
                    <TableCell>{r.permissions_count ?? "-"}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>nun for now</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <>
            <AddRole />{" "}
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

      {/* {hasRoles && (
        <div className="overflow-hidden rounded-b-ml">
          <Pagination
            currentPage={metaData?.current_page ?? currentPage}
            totalItems={metaData?.total ?? 0}
            pageSize={metaData?.per_page ?? 14}
            onPageChange={onPageChange}
          />
        </div>
      )} */}
    </>
  );
}
