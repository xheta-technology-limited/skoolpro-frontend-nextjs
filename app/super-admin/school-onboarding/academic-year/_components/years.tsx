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

const headRow = ["Name", "Start", "End", "Status", "Action"];
export default function AcademicYears() {
  const { data, isPending } = useGetAcademicYears();

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
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
        <Modals />
      </div>
    );
  }
  return (
    <>
      {data?.map((year) => (
        <Year year={year} key={year.id} />
      ))}
      <Modals />
    </>
  );
}

interface YearProps {
  year: AcademicYear;
}
const Year = ({ year }: YearProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <span className="bg-secondary-700 h-4 w-4 rounded-full inline-block mr-2" />
          <Text weight={"accent"} scale={"highlight"}>
            {year.name.toUpperCase()}
          </Text>
        </div>

        <MiniSelector
          items={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
        />
      </div>

      <div className="mb-4 flex justify-between text-neutrals-text-body-light-1 text-[1rem] items-center">
        <span>TERM</span>
        <Button variant="secondary" className="text-primary">
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
                  <TableCell>{term.name}</TableCell>
                  <TableCell>{term.starts_on}</TableCell>
                  <TableCell>{term.ends_on}</TableCell>
                  <TableCell>{titleCase(term.status)}</TableCell>
                  <TableCell>
                    <MiniSelector
                      items={[
                        { label: "Active", value: "active" },
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

const Modals = () => {
  return (
    <>
      <CreateAcademicYear />
      <CreateEducationStructure />
      <CreateClassSections />
      <CreateSubjects />
      <ReviewAcademicYear />
    </>
  );
};
