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
  const [filteredStage, setFilteredStage] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [targetDeleteID, setDeleteID] = useState<undefined | string>(undefined);
  const [editDefaults, setEditDefaults] = useState<
    (CreateSubjectRequest & { subject_id?: string }) | undefined
  >(undefined);
  const {
    data: subjectData,
    isPending: isSubjectsPending,
    isRefetching: isSubjectsRefetching,
  } = useListSubjects(
    {
      department: filteredDepartment || undefined,
      stage: filteredStage || undefined,
    },
    {
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    }
  );
  const subjects: Subject[] = useMemo(() => {
    if (!subjectData) return [];
    const term = searchFilter.trim().toLowerCase();
    if (!term) return subjectData;
    return subjectData.filter((subject) =>
      subject.name.toLowerCase().includes(term)
    );
  }, [subjectData, searchFilter]);

  const { data: departmentData, isPending: isDepartmentPending } =
    useListDepartments({ refetchOnWindowFocus: false });
  const l = createSelectOptions(departmentData, "name", "name");
  const departmentOptions = l
    ? [{ value: "all", label: "All departments" }, ...l]
    : [{ value: "all", label: "All departments" }];

  const { data: stagesData, isPending: isStagesPending } = useListStages({
    refetchOnWindowFocus: false,
  });
  const s = createSelectOptions(stagesData, "name", "name");
  const stageOptions = s
    ? [{ value: "all", label: "All Stages" }, ...s]
    : [{ value: "all", label: "All Stages" }];
  const { mutate: deleteSubjectMutate, isPending: isDeletePending } =
    useDeleteSubject();

  const onEdit = (subject: Subject) => {
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
              SUBJECTS
            </Text>
            {isSubjectsRefetching && <Spinner size={16} color="#5A5555" />}
          </div>
        </div>

        <div className="flex gap-6 items-center">
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

      <div className="flex items-center mb-7 justify-between gap-6">
        <SearchInput
          className="flex-1 max-w-117.5 hidden md:block"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search subject name"
        />
        <div className="flex items-center gap-2 md:gap-8">
          <MiniSelector
            items={departmentOptions}
            defaultValue={"all"}
            onValueChange={(e) => {
              if (e === "all") {
                setFilteredDepartment("");
              } else {
                setFilteredDepartment(e as string);
              }
            }}
          />
          <MiniSelector
            items={stageOptions}
            defaultValue={"all"}
            onValueChange={(e) => {
              if (e === "all") {
                setFilteredStage("");
              } else {
                setFilteredStage(e as string);
              }
            }}
          />
        </div>
      </div>

      <div>
        <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
          {isSubjectsPending && (
            <div className="w-full flex items-center justify-center py-7">
              <Spinner size={70} />
            </div>
          )}

          {!isSubjectsPending && subjects.length === 0 && (
            <div className="w-fit mx-auto">
              {" "}
              <NoData
                title="No Subjects"
                subTitle="You haven't created any subjects, click the button above to make one"
                className="w-97.5 h-143.75"
              />
            </div>
          )}

          {subjects.length > 0 && (
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
                  {subjects.map((b, index) => (
                    <TableRow key={index}>
                      <TableCell>{titleCase(b.name) || ""}</TableCell>
                      <TableCell>{b.code || "-"}</TableCell>
                      <TableCell>{b.department || "-"}</TableCell>
                      <TableCell>
                        {b.intended_stages.length === 0
                          ? "-"
                          : b.intended_stages.map((s) => (
                              <Text
                                key={s.id}
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
