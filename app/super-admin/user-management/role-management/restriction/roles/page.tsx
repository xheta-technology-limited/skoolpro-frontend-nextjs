"use client";

import { MiniButton, Pagination } from "@/components/common";
import Switcher from "../_components/switcher";
import AddRestriction from "../_components/add-restriction";
import { useListUsers } from "@/features/user-management/api/list-users";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import { useState } from "react";
import { Spinner } from "@/components/animations";
import {
  TableWrapper,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { titleCase } from "@/lib/helpers";
import { useProgressRouter } from "@/features/page-loader";
import { useListRoles } from "@/features/role-management/api/list-roles";

const HEADROW = ["Role", "Restrictions", "Action"];
export default function Roles() {
  const {
    data: serverData,
    isPending,
    error,
    isError,
    refetch,
    isRefetching,
  } = useListRoles();
  const router = useProgressRouter();

  const data = serverData?.data;
  const metaData = serverData?.meta;
  const [currentPage, setCurrentPage] = useState(1);
  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="w-fit mx-auto">
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
      <AddRestriction />
      <div className="p-6 bg-white rounded-tr-ml mb-1">
        <Switcher />
        <div className="h-8" />
        <div className="rounded-ml bg-primary-bg p-2 border border-primary-100">
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  {HEADROW.map((col, index) => {
                    const isMiddle = index != 0 && index != HEADROW.length - 1;
                    const style = isMiddle
                      ? "border-t-[1px] border-b-[1px]"
                      : "";
                    return (
                      <TableHead className={style} key={col}>
                        {col}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.map((r, index) => (
                  <TableRow key={index}>
                    <TableCell>{r.label ?? "-"}</TableCell>
                    <TableCell>{r.permissions_count ?? "-"}</TableCell>
                    <TableCell>
                      <MiniButton
                        onClick={() =>
                          router.push(
                            `?add-restriction=true&deniable-type=role&name=${r.label}&role-id=${r.id}`
                          )
                        }
                      >
                        View
                      </MiniButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </div>
      </div>

      {data && data.length && (
        <div className="rounded-b-ml pb-4">
          <Pagination
            currentPage={metaData?.current_page ?? currentPage}
            totalItems={metaData?.total ?? 0}
            pageSize={metaData?.per_page ?? 14}
            onPageChange={(e) => setCurrentPage(e)}
          />
        </div>
      )}
    </>
  );
}
