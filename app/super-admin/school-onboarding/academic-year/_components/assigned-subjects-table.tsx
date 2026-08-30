"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { Text } from "@/components/ui";
import clsx from "clsx";
import { SubjectAssignment } from "@/features/academic-year";
import { Spinner } from "@/components/animations";
import { titleCase } from "@/lib/helpers/string-to-title-case";

const columns = ["Subject", "Applies to", "Compulsory", "Pass mark"];
interface Props {
  data: SubjectAssignment[] | undefined;
  isPending: boolean;
  levelOptions: { value: string; label: string }[];
  selectedLevel: string;
}
export default function AssignedSubjectsTable({
  data,
  isPending,
  levelOptions,
  selectedLevel,
}: Props) {
  if (!data || !selectedLevel) {
    return null;
  }
  return (
    <>
      <div className="flex items-center gap-1">
        <Text className="text-neutrals-700" scale={"content"}>
          {`Assigned to ${
            levelOptions.find((l) => l.value === selectedLevel) || ""
          }`}
        </Text>
        {isPending && <Spinner size={16} color={"#9f9c9c"} />}
      </div>

      <TableWrapper className="mb-4">
        <Table>
          <TableHeader className="[&>tr>th]:after:bg-transparent [&>tr>th]:after:content-[none]">
            <TableRow>
              {columns.map((col, index) => {
                const isMiddle = index != 0 && index != columns.length - 1;
                const style = isMiddle ? "border-t-[1px] border-b-[1px]" : "";
                return (
                  <TableHead
                    className={clsx(style, "text-neutrals-700")}
                    key={col}
                  >
                    {col}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((lvl, index) => (
              <TableRow
                key={lvl.id}
                className={clsx(
                  "text-neutrals-900",
                  index === 4 && "[&>td]:border-b-0"
                )}
              >
                <TableCell>{titleCase(lvl.subject.name)}</TableCell>
                <TableCell>
                  {lvl.section ? lvl.section.name : "Whole class"}
                </TableCell>
                <TableCell>{lvl.is_compulsory ? "Yes" : "No"}</TableCell>
                <TableCell>{lvl.pass_mark}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </>
  );
}
