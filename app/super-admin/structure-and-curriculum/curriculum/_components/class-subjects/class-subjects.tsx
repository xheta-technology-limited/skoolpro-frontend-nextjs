"use client";
import { Spinner } from "@/components/animations";
import { MiniSelector } from "@/components/common";
import { Text } from "@/components/ui";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { createSelectOptions, titleCase } from "@/lib/helpers";
import { keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { NoData } from "@/components/icons";
import { useListClassSections } from "@/features/academic-year/api/list-class-sections";
import { BlockElement } from "../../../_components/block-element";
import { useListSubjectsByClassSection } from "@/features/academic-year/api/list-subjects-by-class-section";

const headRow = ["Subject", "Requirement", "Pass mark", "Offered via"];

export default function ClassSubjects() {
  const [selectedClass, setSelectedClass] = useState("");
  const {
    data: subjects,
    isPending: isSubjectsPending,
    isRefetching: isSubjectsRefetching,
    isError,
    error: assignmentError,
  } = useListSubjectsByClassSection(
    selectedClass || "",

    {
      refetchOnWindowFocus: false,
      enabled: !!selectedClass,
      placeholderData: keepPreviousData,
    }
  );

  const { data: sectionData } = useListClassSections({
    refetchOnWindowFocus: false,
  });
  const l = createSelectOptions(sectionData, "id", "name");
  const classOptions = l
    ? [{ value: "nil", label: "Select a class" }, ...l]
    : [{ value: "nil", label: "Select a class" }];

  return (
    <div>
      <div className="w-full mb-4 flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-col gap-1 text-left max-w-146.5">
          <div className="flex gap-2 items-center">
            <Text className="text-neutrals-700" scale={"content"}>
              CLASS OFFERS
            </Text>
            {isSubjectsRefetching && <Spinner size={16} color="#5A5555" />}
          </div>
        </div>

        <div className="flex gap-6 items-center">
          <MiniSelector
            items={classOptions || []}
            defaultValue={"nil"}
            onValueChange={(e) => {
              if (e === "nil") {
                setSelectedClass("");
              } else {
                setSelectedClass(e as string);
              }
            }}
          />
        </div>
      </div>

      {subjects?.meta && (
        <div className="flex gap-2.5 flex-wrap mb-4">
          <BlockElement
            label={"Subjects Offered"}
            num={subjects?.meta.total_subject_offered || 0}
          />
          <BlockElement
            label={"Compulsory"}
            num={subjects?.meta?.compulsory_count || 0}
          />
          <BlockElement
            label={"Electives"}
            num={subjects?.meta?.elective_count || 0}
          />
          <BlockElement
            label={"Class specific"}
            num={subjects?.meta?.class_specific_count || 0}
          />
        </div>
      )}

      <div>
        <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
          {!selectedClass ? (
            <Text scale={"caption"} className="text-neutrals-800">
              Select a class to view subjects.
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
              {isSubjectsPending && (
                <div className="w-full flex items-center justify-center py-7">
                  <Spinner size={70} />
                </div>
              )}

              {!isSubjectsPending && subjects?.data.length === 0 && (
                <Text scale={"caption"} className="text-neutrals-800">
                  No subjects for the selected level.
                </Text>
              )}

              {subjects && subjects?.data.length > 0 && (
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
                      {subjects?.data.map((b, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {titleCase(b.subject.name) || ""}
                          </TableCell>

                          <TableCell>
                            {b.is_compulsory ? (
                              <Text
                                className="text-success-300"
                                scale={"caption"}
                              >
                                Compulsory
                              </Text>
                            ) : (
                              "Elective"
                            )}
                          </TableCell>
                          <TableCell>{b.pass_mark}</TableCell>
                          <TableCell>
                            {!b.is_whole_level ? (
                              <Text
                                className="text-[rgba(0, 136, 255, 1)]"
                                scale={"caption"}
                              >
                                This class
                              </Text>
                            ) : (
                              "Whole level"
                            )}
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
