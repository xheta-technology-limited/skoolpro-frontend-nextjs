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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import { useListRoles } from "@/features/role-management/api/list-roles";
import AddRole from "./add-role";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DeleteModal } from "@/components/common";
import { useDisableRole } from "@/features/role-management/api/disable-role";
import { toast } from "sonner";

const HEADROW = ["Role Name", "Permissions", "Date Created", "Action"];

export default function Body() {
  const router = useProgressRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverOpenID, setPopoverOpenID] = useState<number | null>(null);
  const [deleteID, setDeleteID] = useState<number | null>(null);
  const [searchKey, setSearchKey] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: allRoles,
    isRefetching,
    refetch,
    error,
    isPending,
  } = useListRoles();
  const hasRoles = allRoles && allRoles.length > 0;

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

  const { mutate: deleteMutate, isPending: isDeletePending } = useDisableRole();

  const onDelete = () => {
    if (!deleteID) {
      console.error("No delete ID");
      return;
    }
    deleteMutate(
      { id: String(deleteID) },
      {
        onSuccess: () => {
          setDeleteID(null);
          toast.success("Role deleted");
        },
        onError: () => {
          setDeleteID(null);
        },
      }
    );
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
      <DeleteModal
        title="Delete Role"
        open={!!deleteID}
        onOpenChange={() => setDeleteID(null)}
        description="You are about to delete this role, do you want to proceed with this action."
        onConfirm={onDelete}
        confirmText="Delete role"
        cancelText="Cancel"
      />
      <div className="rounded-tr-ml flex-1 overflow-auto">
        <div className="bg-white p-4 rounded-t-ml">
          <div className="flex items-center gap-6">
            <SearchInput
              value={searchFilter}
              onChange={onSearchInputChange}
              placeholder="Search role"
              className="flex-1"
            />
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
                    <TableCell>
                      <Popover
                        open={popoverOpen && popoverOpenID === r.id}
                        onOpenChange={() => {
                          const open = popoverOpen && popoverOpenID === r.id;
                          if (!open) {
                            setPopoverOpen(true);
                            setPopoverOpenID(r.id);
                          } else {
                            setPopoverOpen(false);
                            setPopoverOpenID(null);
                          }
                        }}
                      >
                        <PopoverTrigger
                          render={
                            <button className="border-none rounded-full hover:bg-primary-100 transition-colors p-2">
                              <DotsThreeVerticalIcon size={20} />
                            </button>
                          }
                        />
                        <PopoverContent className="w-48 overflow-hidden p-0 rounded-[16px] bg-white py-4 flex flex-col gap-2">
                          <button className="h-8 text-left border-b-grays-borders pl-4 px-8 hover:bg-grays-borders transition-colors">
                            <Text className="text-left" scale={"caption"}>
                              Edit
                            </Text>
                          </button>
                          <button
                            onClick={() => {
                              setPopoverOpen(false);
                              setPopoverOpenID(null);
                              setDeleteID(r.id);
                            }}
                            className="h-8 text-left border-b-grays-borders pl-4 px-8 hover:bg-grays-borders transition-colors"
                          >
                            <Text className="text-left" scale={"caption"}>
                              Delete
                            </Text>
                          </button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
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
    </>
  );
}
