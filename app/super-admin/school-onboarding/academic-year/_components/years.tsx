"use client";
import { Text } from "@/components/ui";
import { dummyData } from "../constants";
import { Button } from "@/components/ui/custom-button";
import { Add } from "iconsax-reactjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { MiniSelector } from "@/components/common";
import CreateAcademicYear from "./create-academic-year";
import CreateEducationStructure from "./create-education-structure";
import CreateClassSections from "./create-class-sections";
import CreateSubjects from "./create-subjects";
import ReviewAcademicYear from "./review-modal";
import { useGetAcademicYears } from "@/features/academic-year/api/list-academic-years";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { AcademicYear } from "@/features/academic-year";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import { useSetCurrentTerm } from "@/features/academic-year/api/set-term-to-current";
import { useSetCurrentYear } from "@/features/academic-year/api/set-year-to-current";
import { useState } from "react";
import { toast } from "sonner";
import { useProgressRouter } from "@/features/page-loader";

const headRow = ["Name", "Start", "End", "Status", "Action"];
export default function AcademicYears() {
  const { data, isPending, error, refetch, isFetching } = useGetAcademicYears();
  const [termToMutate, setTermToMutate] = useState("");
  const {
    mutate: setCurrentTermMutate,
    isPending: isCurrentTermMutatePending,
  } = useSetCurrentTerm(termToMutate);

  const [yearToMutate, setYearToMutate] = useState("");
  const {
    mutate: setCurrentYearMutate,
    isPending: isCurrentYearMutatePending,
  } = useSetCurrentYear(yearToMutate);

  const setCurrentTerm = (termID: string) => {
    setTermToMutate(termID);
    setCurrentTermMutate(
      {},
      { onSuccess: () => toast.success("Data updated successfully") }
    );
  };

  const setCurrentYear = (yearID: string) => {
    setYearToMutate(yearID);
    setCurrentYearMutate(
      {},
      { onSuccess: () => toast.success("Data updated successfully") }
    );
  };
  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-fit mx-auto">
        {" "}
        <NoData
          variant="signal"
          title="Something went Wrong"
          subTitle={error.message || ""}
          className="w-97.5 h-143.75"
        />
        <Button
          className="mt-3 w-full"
          loading={isFetching}
          onClick={() => refetch()}
          size="lg"
        >
          Retry
        </Button>
        <Modals data={data} />
      </div>
    );
  }

  if (data && data.length === 0) {
    return (
      <div className="w-fit mx-auto">
        {" "}
        <NoData
          title="No Academic Years"
          subTitle="You haven't created any academic years, click the button above to make one"
          className="w-97.5 h-143.75"
        />
        <Modals data={data} />
      </div>
    );
  }
  return (
    <>
      {data?.map((year) => (
        <Year
          year={year}
          key={year.id}
          onSetCurrentTerm={setCurrentTerm}
          termToMutate={termToMutate}
          isCurrentTermMutatePending={isCurrentTermMutatePending}
          onSetCurrentYear={setCurrentYear}
          yearToMutate={yearToMutate}
          isCurrentYearMutatePending={isCurrentYearMutatePending}
        />
      ))}
      <Modals data={data} />
    </>
  );
}

interface YearProps {
  year: AcademicYear;
  onSetCurrentTerm: (termID: string) => void;
  termToMutate: string;
  isCurrentTermMutatePending: boolean;
  onSetCurrentYear: (yearID: string) => void;
  yearToMutate: string;
  isCurrentYearMutatePending: boolean;
}
const Year = ({
  year,
  onSetCurrentTerm,
  termToMutate,
  isCurrentTermMutatePending,
  onSetCurrentYear,
  yearToMutate,
  isCurrentYearMutatePending,
}: YearProps) => {
  const router = useProgressRouter();
  const isPending = (id: string) => {
    return termToMutate === id && isCurrentTermMutatePending;
  };
  const isYearPending = yearToMutate === year.id && isCurrentYearMutatePending;
  return (
    <div className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <span className="bg-secondary-700 h-4 w-4 rounded-full inline-block mr-2" />
          <Text weight={"accent"} scale={"highlight"}>
            {year.name.toUpperCase()}
          </Text>
        </div>

        <MiniSelector
          disabled={isYearPending}
          onValueChange={() => onSetCurrentYear(year.id)}
          value={year.status === "current" ? "active" : "inactive"}
          items={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
      </div>

      <div className="mb-4 flex justify-between text-neutrals-text-body-light-1 text-[1rem] items-center">
        <span>TERM</span>
        <Button
          variant="secondary"
          className="text-primary"
          onClick={() =>
            router.push(
              `/super-admin/school-onboarding/academic-year?open=true&step=1&editId=${year.id}`
            )
          }
        >
          <Add size={16} />
          <Text weight={"standard"} scale={"caption"}>
            Edit
          </Text>
        </Button>
      </div>

      <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                {headRow.map((col, index) => {
                  const isMiddle = index != 0 && index != headRow.length - 1;
                  const style = isMiddle ? "border-t-[1px] border-b-[1px]" : "";
                  return (
                    <TableHead className={style} key={col}>
                      {col}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            <TableBody>
              {year.terms.map((term, index) => (
                <TableRow key={term.id}>
                  <TableCell>{titleCase(term.name)}</TableCell>
                  <TableCell>{term.starts_on}</TableCell>
                  <TableCell>{term.ends_on}</TableCell>
                  <TableCell>{titleCase(term.status)}</TableCell>
                  <TableCell>
                    <MiniSelector
                      disabled={isPending(term.id)}
                      onValueChange={() => onSetCurrentTerm(term.id)}
                      value={term.status === "current" ? "current" : "inactive"}
                      items={[
                        { label: "Active", value: "current" },
                        { label: "Inactive", value: "inactive" },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </div>
    </div>
  );
};

const Modals = ({ data }: { data: AcademicYear[] | undefined }) => {
  return (
    <>
      <CreateAcademicYear />
      <CreateEducationStructure data={data} />
      <CreateClassSections />
      <CreateSubjects />
      <ReviewAcademicYear />
    </>
  );
};
