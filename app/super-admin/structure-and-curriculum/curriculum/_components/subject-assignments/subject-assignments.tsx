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
import { useMemo, useState } from "react";
import AddSubject from "../modals/add-subject";
import { CreateArmFormData } from "@/features/academic-year/schemas/create-arm";
import { useDeleteArm } from "@/features/academic-year/api/delete-arm";
import { toast } from "sonner";
import { useListSubjects } from "@/features/academic-year/api/list-subjects";
import { NoData } from "@/components/icons";
import { useDeleteSubject } from "@/features/academic-year/api/delete-subject";
import { useListDepartments } from "@/features/academic-year/api/list-departments";
import { useListStages } from "@/features/academic-year/api/list-stages";
import { SearchInput } from "@/components/ui/form/input";
import { Subject } from "@/features/academic-year/types/api/subjects";
import { CreateSubjectRequest } from "@/features/academic-year/schemas/create-subject-schema";
import { useListLevelSubjectAssignments } from "@/features/academic-year/api/list-level-overview";
import { error } from "console";
import { SubjectAssignment } from "@/features/academic-year";

const headRow = [
  "Subject",
  "Scope",
  "Requirement",
  "Pass mark",
  "Status",
  "Action",
];

export default function SubjectAssignments() {
  const router = useProgressRouter();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [targetDeleteID, setDeleteID] = useState<undefined | string>(undefined);
  const [editDefaults, setEditDefaults] = useState<
    (CreateSubjectRequest & { subject_id?: string }) | undefined
  >(undefined);
  const {
    data: assignments,
    isPending: isAssignmentsPending,
    isRefetching: isAssignmentsRefetching,
    isError,
    error: assignmentError,
  } = useListLevelSubjectAssignments(
    selectedLevel || "",

    {
      refetchOnWindowFocus: false,
      enabled: !!selectedLevel,
      placeholderData: keepPreviousData,
    }
  );

  const { data: levelsData, isPending: isLevelsPending } = useListLevels({
    refetchOnWindowFocus: false,
  });
  const l = createSelectOptions(levelsData, "id", "name");
  const levelOptions = l
    ? [{ value: "nil", label: "Select level" }, ...l]
    : [{ value: "nil", label: "Select level" }];

  const { mutate: deleteSubjectMutate, isPending: isDeletePending } =
    useDeleteSubject();

  const onEdit = (subject: SubjectAssignment) => {
    setEditDefaults({
      subject_id: subject.id,
      name: subject.name || "",
      code: subject.code || "",
      description: subject.description || "",
      department: subject.department || "",
      is_active: subject.is_active,
      intended_stage_ids: subject.intended_stages.map((stage) => stage.id),
    });
    router.push(
      `/super-admin/structure-and-curriculum/curriculum?tab=subjects&add-subject=true&subject-id=${subject.id}`
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
        open={deleteModal && !!targetDeleteID}
        onOpenChange={onAbortDelete}
        description="Delete this subject?"
        onConfirm={onDeleteSubject}
      />
      <AddSubject defaults={editDefaults} />
      <div className="w-full mb-4 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-col gap-1 text-left max-w-146.5">
          <div className="flex gap-2 items-center">
            <Text className="text-neutrals-700" scale={"content"}>
              SUBJECT ASSIGNMENTS
            </Text>
            {isAssignmentsRefetching && <Spinner size={16} color="#5A5555" />}
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <MiniSelector
            items={levelOptions || []}
            defaultValue={"nil"}
            onValueChange={(e) => {
              if (e === "nil") {
                setSelectedLevel("");
              } else {
                setSelectedLevel(e as string);
              }
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
            Assign subject
          </Button>
        </div>
      </div>

      <div>
        <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
          {!selectedLevel ? (
            <Text scale={"caption"} className="text-neutrals-800">
              Select a level to view assignments.
            </Text>
          ) : (
            <>
              {isError && (
                <div className="w-fit mx-auto">
                  {" "}
                  <NoData
                    title="Something went wrong"
                    variant="signal"
                    subTitle={assignmentError.message}
                    className="w-97.5 h-143.75"
                  />
                </div>
              )}
              {isAssignmentsPending && (
                <div className="w-full flex items-center justify-center py-7">
                  <Spinner size={70} />
                </div>
              )}

              {!isAssignmentsPending && assignments?.length === 0 && (
                <div className="w-fit mx-auto">
                  {" "}
                  <NoData
                    title="No Subject Assignments"
                    subTitle="You haven't assigned any subjects, click the button above to make assignments"
                    className="w-97.5 h-143.75"
                  />
                </div>
              )}

              {assignments && assignments?.length > 0 && (
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
                      {assignments?.map((b, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {titleCase(b.subject.name) || ""}
                          </TableCell>
                          <TableCell>
                            {b.is_whole_level ? (
                              <Text
                                className="text-[rgba(0, 136, 255, 1)]"
                                scale={"caption"}
                              >
                                Whole level
                              </Text>
                            ) : (
                              titleCase(b.section?.name ?? "") || "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {b.is_compulsory ? (
                              <Text
                                className="text-success-300"
                                scale={"caption"}
                              >
                                Whole level
                              </Text>
                            ) : (
                              "Elective"
                            )}
                          </TableCell>
                          <TableCell>{b.pass_mark}</TableCell>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
