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
  TableWrapper,
} from "@/components/ui/table";
import { ChangeEvent, CSSProperties, useEffect, useRef, useState } from "react";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import { useListRoles } from "@/features/role-management/api/list-roles";
import AddRole from "../_components/modals/add-role";
import CloneRole from "../_components/modals/clone-role";
import { DeleteModal, MiniButton, Pagination } from "@/components/common";
import { useDisableRole } from "@/features/role-management/api/disable-role";
import { toast } from "sonner";
import Counts from "./_components/counts";
import { Lock1 } from "iconsax-reactjs";
import { keepPreviousData } from "@tanstack/react-query";
import { FilterType } from "./constants";
import { useEnableRole } from "@/features/role-management/api/enable-role";

const HEADROW = ["Role", "Type", "Permissions", "Holders", "Status", "Action"];
const FILTERS = ["All", "System", "Custom", "Disabled"];

export default function Body() {
  const router = useProgressRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const [disablingID, setDisablingID] = useState<null | number>(null);
  const [cloneID, setCloneID] = useState<null | number>(null);

  const returnFilter: FilterType =
    filter === "disabled"
      ? { disabled: true }
      : filter === "custom"
      ? { role_type: "custom" }
      : filter === "system"
      ? { role_type: "system" }
      : undefined;

  const {
    data: allRoles,
    isRefetching,
    refetch,
    error,
    isPending,
  } = useListRoles(
    { ...returnFilter, page: currentPage || undefined },
    {
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    }
  );
  const hasRoles = allRoles && allRoles.data?.length > 0;
  const metaData = allRoles?.meta;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { mutate: disableMutate, isPending: isDisablePending } =
    useDisableRole();
  const { mutate: enableMutate, isPending: isEnablePending } = useEnableRole();

  if (error) {
    return (
      <div className="w-fit mx-auto">
        <AddRole />
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
      <div className="p-6 bg-white rounded-tr-ml mb-1">
        <Counts />
        <div className="h-8" />

        <>
          <CloneRole />

          <div className="rounded-tr-ml flex-1 overflow-auto">
            {isPending ? (
              <div className="w-full flex items-center justify-center py-7">
                <Spinner size={70} />
              </div>
            ) : hasRoles ? (
              <>
                <div className="mb-8 flex gap-2 items-center flex-wrap">
                  {FILTERS.map((f) => (
                    <Filter
                      key={f}
                      label={f}
                      onClick={() => setFilter(f.toLocaleLowerCase())}
                      isActive={f.toLocaleLowerCase() === filter}
                    />
                  ))}
                  {isRefetching && (
                    <Spinner size={14} color="var(--color-neutrals-700)" />
                  )}
                </div>
                <div className="rounded-ml bg-primary-bg p-2 border border-primary-100">
                  <TableWrapper>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {HEADROW.map((col, index) => {
                            const isMiddle =
                              index != 0 && index != HEADROW.length - 1;
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
                        {allRoles.data?.map((r, index) => {
                          const date = new Date(
                            r.created_at
                          ).toLocaleDateString();
                          return (
                            <TableRow key={index}>
                              <TableCell>{titleCase(r.label) ?? "-"}</TableCell>
                              <TableCell>
                                {r.is_protected ? "System" : "Custom"}
                              </TableCell>
                              <TableCell>
                                {r.permissions_count ?? "-"}
                              </TableCell>
                              <TableCell>{r.users_count ?? "-"}</TableCell>
                              <TableCell>
                                {r.is_active ? (
                                  <Text
                                    scale={"caption"}
                                    className="text-success-300"
                                  >
                                    Active
                                  </Text>
                                ) : (
                                  <Text
                                    scale={"caption"}
                                    className="text-warning-200"
                                  >
                                    Disabled
                                  </Text>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MiniButton
                                    onClick={() =>
                                      router.push(`?view-role=${r.id}`)
                                    }
                                  >
                                    View
                                  </MiniButton>

                                  <MiniButton
                                    onClick={() =>
                                      router.push(
                                        `?add-role=true&edit-role=${r.id}`
                                      )
                                    }
                                  >
                                    Edit
                                  </MiniButton>
                                  <MiniButton
                                    onClick={() =>
                                      router.push(
                                        `?clone-role=true&role-id=${r.id}`
                                      )
                                    }
                                  >
                                    Clone
                                  </MiniButton>
                                  {r.is_protected ? (
                                    <div className="flex gap-1 items-center">
                                      <Lock1
                                        size={12}
                                        variant="Bulk"
                                        className="text-secondary-800"
                                      />{" "}
                                      Locked
                                    </div>
                                  ) : r.is_active ? (
                                    <MiniButton
                                      variant="error"
                                      loading={
                                        isDisablePending && disablingID === r.id
                                      }
                                      onClick={() => {
                                        setDisablingID(r.id);
                                        disableMutate(
                                          { id: r.id },
                                          {
                                            onSettled: () =>
                                              setDisablingID(null),
                                          }
                                        );
                                      }}
                                    >
                                      Disable
                                    </MiniButton>
                                  ) : !r.is_active ? (
                                    <MiniButton
                                      loading={isEnablePending}
                                      onClick={() => {
                                        enableMutate({ id: r.id });
                                      }}
                                      variant="success"
                                    >
                                      Enable
                                    </MiniButton>
                                  ) : null}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableWrapper>
                </div>
              </>
            ) : (
              <>
                <div className="w-fit mx-auto">
                  {" "}
                  <NoData
                    title="No Roles"
                    subTitle="You haven't added any roles yet, click the button above to make one"
                    className="w-97.5 h-143.75"
                  />
                </div>
              </>
            )}
          </div>
        </>
      </div>

      {allRoles?.data.length && (
        <div className="rounded-b-ml pb-4">
          <Pagination
            currentPage={metaData?.current_page ?? currentPage}
            totalItems={metaData?.total ?? 0}
            pageSize={metaData?.per_page ?? 14}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}

const Filter = ({
  isActive,
  onClick,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
}) => {
  const activeStyle: CSSProperties = {
    color: "white",
    backgroundColor: "var(--color-primary-900)",
  };
  const styles: CSSProperties = {
    backgroundColor: "transparent",
  };
  return (
    <button
      onClick={onClick}
      style={isActive ? activeStyle : styles}
      className="px-6 py-2 rounded-sm"
    >
      <Text
        style={{ color: isActive ? "white" : "var(--color-neutrals-700)" }}
        scale={"caption"}
      >
        {label}
      </Text>
    </button>
  );
};
