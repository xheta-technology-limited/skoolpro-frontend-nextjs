"use client";

import { Text } from "@/components/ui";
import StructureItem from "../structure-item";
import { useListStages } from "@/features/academic-year/api/list-stages";
import { Spinner } from "@/components/animations";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { titleCase } from "@/lib/helpers";
import { CloseSquare, Edit } from "iconsax-reactjs";
import { useDeleteLevel } from "@/features/academic-year/api/delete-level";
import { useState } from "react";
import { DeleteModal } from "@/components/common";
import { toast } from "sonner";
import AddLevel from "../modals/add-level";

const headRow = [
  "Level",
  "Code",
  "Global seq",
  "In stage",
  "Entry age",
  "Status",
  "Action",
];

export default function Stages() {
  const router = useProgressRouter();
  const [deleteModal, setDeleteModal] = useState(false);
  const [targetDeleteID, setDeleteID] = useState<undefined | string>(undefined);
  const {
    data: stages,
    isPending,
    error,
    isRefetching,
    refetch,
  } = useListStages({
    refetchOnWindowFocus: false,
  });
  const { mutate: deleteLevel, isPending: isDeletePending } = useDeleteLevel();

  const onEdit = (slug: string) => {
    // router.push(`?modal=true&edit=true&stage=${slug}`)
    alert("not implemented");
  };

  const onAbortDelete = () => {
    setDeleteID(undefined);
    setDeleteModal(false);
  };
  const onDeleteLevel = () => {
    if (!targetDeleteID) {
      alert("No level ID!");
      return;
    }
    deleteLevel(
      { levelId: targetDeleteID },
      {
        onSuccess: () => {
          setDeleteID(undefined);
        },
        onError: (err) => {
          toast.error(err.message || "Something went wrong");
        },
      }
    );
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <AddLevel />
        <Spinner size={16} color="rgba(67, 62, 63, 1)" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full text-center flex flex-col gap-2 justify-center">
        <AddLevel />
        <Text scale={"caption"} className="text-neutrals-800">
          Something went wrong
        </Text>
        <Text scale={"caption"} className="text-neutrals-800">
          {error.message}
        </Text>
        <Button loading={isRefetching} size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col gap-8">
      <DeleteModal
        loading={isDeletePending}
        open={deleteModal}
        onOpenChange={onAbortDelete}
        description="Delete this level?"
        onConfirm={onDeleteLevel}
      />
      <AddLevel />
      {stages.map((s) => (
        <StructureItem
          isLoading={isRefetching}
          label={s.name.toUpperCase()}
          primaryButtonText="Add level"
          primaryButtonFunc={() =>
            router.push(
              "/super-admin/structure-and-curriculum/structure?tab=education&add-level=true"
            )
          }
          key={s.id}
        >
          <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow>
                    {headRow.map((col, index) => {
                      const isMiddle =
                        index != 0 && index != headRow.length - 1;
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
                  {s.levels.map((b, index) => (
                    <TableRow key={index}>
                      <TableCell>{titleCase(b.name) || ""}</TableCell>
                      <TableCell>{b.code}</TableCell>
                      <TableCell>{b.global_sequence || "-"}</TableCell>
                      <TableCell>{"placeholder for now"}</TableCell>
                      <TableCell>{b.typical_entry_age || "-"}</TableCell>
                      <TableCell
                        style={{
                          color: b.is_active ? "#0b7b69" : "#CC7914",
                        }}
                      >
                        {b.is_active ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2.5 items-center">
                          <button
                            className="py-1.5 px-2 rounded-[12px] text-[0.75rem] flex items-center border border-grays-borders"
                            onClick={() => onEdit("t")}
                          >
                            <Edit
                              variant="Bulk"
                              size={12}
                              className="text-neutrals-800"
                            />
                            <Text
                              scale={"captionMobile"}
                              className="text-neutrals-700"
                            >
                              Edit
                            </Text>
                          </button>

                          <button
                            onClick={() => {
                              setDeleteID(b.id);
                              setDeleteModal(true);
                            }}
                          >
                            <CloseSquare
                              variant="Bulk"
                              size={20}
                              className="text-neutrals-800"
                            />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </div>
        </StructureItem>
      ))}
    </div>
  );
}
