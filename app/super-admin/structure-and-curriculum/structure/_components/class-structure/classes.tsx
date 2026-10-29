"use client";
import { Spinner } from "@/components/animations";
import { DeleteModal, MiniSelector } from "@/components/common";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useListArms } from "@/features/academic-year/api/list-arms";
import { useListLevels } from "@/features/academic-year/api/list-levels";
import { useProgressRouter } from "@/features/page-loader";
import { createSelectOptions, titleCase } from "@/lib/helpers";
import { keepPreviousData } from "@tanstack/react-query";
import { AddSquare, CloseSquare, Edit } from "iconsax-reactjs";
import { useState } from "react";
import AddClass from "../modals/add-class";
import { CreateArmFormData } from "@/features/academic-year/schemas/create-arm";
import { useDeleteArm } from "@/features/academic-year/api/delete-arm";
import { toast } from "sonner";

const headRow = [
  "Class",
  "Code",
  "Class Teacher",
  "Capacity",
  "Subjects",
  "Status",
  "Action",
];

export default function ClassStructure() {
  const router = useProgressRouter();
  const [selectedLevel, setSelectedLevel] = useState<null | string>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [targetDeleteID, setDeleteID] = useState<undefined | string>(undefined);
  const [editDefaults, setEditDefaults] = useState<
    (CreateArmFormData & { level_id?: string; arm_id?: string }) | undefined
  >(undefined);
  const { data: levelData, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const l = createSelectOptions(levelData, "id", "name");
  const levelOptions = l
    ? [{ value: "none", label: "Select a class" }, ...l]
    : [{ value: "none", label: "loading classes" }];
  const {
    data: classArmsData,
    isLoading: isArmsPending,
    isFetching: isArmsFetching,
  } = useListArms(selectedLevel || "", {
    refetchOnWindowFocus: false,
    enabled: !!selectedLevel,
    placeholderData: keepPreviousData,
  });
  const hasSelection = !!selectedLevel && selectedLevel !== "none";
  const { mutate: deleteArm, isPending: isDeletePending } = useDeleteArm(
    selectedLevel || ""
  );

  const onEdit = (arm: any) => {
    setEditDefaults({
      level_id: arm.level_id || selectedLevel || "",
      arm_id: arm.id,
      name: arm.name || "",
      code: arm.code || "",
      staff_id: arm.staff_id || "",
      capacity: arm.capacity?.toString() || "",
    });
    router.push(
      `/super-admin/structure-and-curriculum/structure?tab=classes&add-class=true&arm-id=${arm.id}`
    );
  };

  const onAbortDelete = () => {
    setDeleteID(undefined);
    setDeleteModal(false);
  };
  const onDeleteClass = () => {
    if (!targetDeleteID) {
      alert("No level ID!");
      return;
    }
    deleteArm(
      { armId: targetDeleteID },
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
  return (
    <div>
      <DeleteModal
        loading={isDeletePending}
        open={deleteModal && !!targetDeleteID}
        onOpenChange={onAbortDelete}
        description="Delete this level?"
        onConfirm={onDeleteClass}
      />
      <AddClass defaults={editDefaults} />
      <div className="w-full mb-4 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-col gap-1 text-left max-w-146.5">
          <div className="flex gap-2 items-center">
            <Text className="text-neutrals-700" scale={"content"}>
              Classes
            </Text>
            {(isArmsFetching || isArmsPending) && (
              <Spinner size={16} color="#5A5555" />
            )}
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <MiniSelector
            items={isLevelsPending ? [] : levelOptions ?? []}
            defaultValue={"none"}
            onValueChange={(e) => setSelectedLevel(e as string)}
          />

          <Button
            onClick={() => {
              setEditDefaults(undefined);
              router.push(
                `/super-admin/structure-and-curriculum/structure?tab=classes&add-class=true${
                  selectedLevel && selectedLevel !== "none"
                    ? `&level-id=${selectedLevel}`
                    : ""
                }`
              );
            }}
            leftIcon={
              <AddSquare variant="Bulk" size={16} className="text-primary" />
            }
            variant="secondary"
            className="px-6 whitespace-nowrap"
            size="sm"
          >
            Add Class
          </Button>
        </div>
      </div>

      <div>
        <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
          {classArmsData?.length === 0 ? (
            <Text scale={"caption"} className="text-neutrals-800">
              No classes yet.
            </Text>
          ) : !hasSelection ? (
            <Text scale={"caption"} className="text-neutrals-800">
              Select a class.
            </Text>
          ) : (
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
                  {classArmsData?.map((b, index) => (
                    <TableRow key={index}>
                      <TableCell>{titleCase(b.name) || ""}</TableCell>
                      <TableCell>{b.code || "-"}</TableCell>
                      <TableCell>{"placeholder, no teacher name"}</TableCell>
                      <TableCell>{b.capacity || "-"}</TableCell>
                      <TableCell>
                        {"placeholder, no subject counts from backend"}
                      </TableCell>
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
                            onClick={() => onEdit(b)}
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
          )}
        </div>
      </div>
    </div>
  );
}
