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
import AddSubject from "../modals/add-subject";
import { CreateArmFormData } from "@/features/academic-year/schemas/create-arm";
import { useDeleteArm } from "@/features/academic-year/api/delete-arm";
import { toast } from "sonner";
import { useListSubjects } from "@/features/academic-year/api/list-subjects";
import { NoData } from "@/components/icons";
import { useDeleteSubject } from "@/features/academic-year/api/delete-subject";

const headRow = [
  "Subject",
  "Code",
  "Department",
  "Intended stages",
  "Status",
  "Action",
];

export default function Subjects() {
  const router = useProgressRouter();
  const [filteredDepartment, setFilteredDepartment] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [targetDeleteID, setDeleteID] = useState<undefined | string>(undefined);
  const [editDefaults, setEditDefaults] = useState<
    (CreateArmFormData & { level_id?: string; arm_id?: string }) | undefined
  >(undefined);
  const {
    data: subjectData,
    isPending: isSubjectsPending,
    isRefetching: isSubjectsRefetching,
  } = useListSubjects(filteredDepartment, {
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const { mutate: deleteSubjectMutate, isPending: isDeletePending } =
    useDeleteSubject();

  const onEdit = (arm: any) => {
    setEditDefaults({
      level_id: arm.level_id || "",
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
  const onDeleteSubject = () => {
    if (!targetDeleteID) {
      alert("No level ID!");
      return;
    }
    deleteSubjectMutate(
      { subjectId: targetDeleteID },
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
        open={deleteModal}
        onOpenChange={onAbortDelete}
        description="Delete this level?"
        onConfirm={onDeleteSubject}
      />
      <AddSubject defaults={editDefaults} />
      <div className="w-full mb-4 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-col gap-1 text-left max-w-146.5">
          <div className="flex gap-2 items-center">
            <Text className="text-neutrals-700" scale={"content"}>
              SUBJECTS
            </Text>
            {isSubjectsRefetching && <Spinner size={16} color="#5A5555" />}
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <MiniSelector
            items={[
              { value: "all", label: "All departments" },
              { value: "imp", label: "implement this" },
            ]}
            defaultValue={"all"}
            onValueChange={(e) => {
              return;
              //does nothing till departments are up
            }}
          />

          <Button
            onClick={() => {
              setEditDefaults(undefined);
              router.push(
                "/super-admin/structure-and-curriculum/curriculum?tab=subjects&add-subject=true"
              );
            }}
            leftIcon={
              <AddSquare variant="Bulk" size={16} className="text-primary" />
            }
            variant="secondary"
            className="px-6 whitespace-nowrap"
            size="sm"
          >
            Add Subject
          </Button>
        </div>
      </div>

      <div>
        <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
          {isSubjectsPending && (
            <div className="w-full flex items-center justify-center py-7">
              <Spinner size={70} />
            </div>
          )}

          {subjectData && subjectData.length === 0 && (
            <div className="w-fit mx-auto">
              {" "}
              <NoData
                title="No Academic Years"
                subTitle="You haven't created any academic years, click the button above to make one"
                className="w-97.5 h-143.75"
              />
            </div>
          )}

          {subjectData && subjectData.length > 0 && (
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
                  {subjectData.map((b, index) => (
                    <TableRow key={index}>
                      <TableCell>{titleCase(b.name) || ""}</TableCell>
                      <TableCell>{b.code || "-"}</TableCell>
                      <TableCell>{b.department || "-"}</TableCell>
                      <TableCell>
                        {b.intended_stages.length === 0
                          ? "-"
                          : b.intended_stages.map((s) => (
                              <Text
                                as="span"
                                className="text-primary"
                                scale={"caption"}
                              >{`${s.code} `}</Text>
                            ))}
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
