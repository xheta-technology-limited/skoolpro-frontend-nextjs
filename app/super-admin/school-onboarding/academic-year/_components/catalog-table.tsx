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
import { Subject } from "@/features/academic-year";
import { Text } from "@/components/ui";
import clsx from "clsx";
import { Spinner } from "@/components/animations";

const columns = ["Subject", "Code", "Department", "Stages"];
interface Props {
  data: Subject[] | undefined;
  isSubjectsPending: boolean;
}
export default function CatalogTable({ data, isSubjectsPending }: Props) {
  //call api here
  //return spinner if loading
  if (!data) {
    return null;
  }
  return (
    <>
      <div className="flex items-center gap-1">
        <Text className="text-neutrals-700" scale={"content"}>
          Subject catalog
        </Text>
        {isSubjectsPending && <Spinner size={16} color={"#9f9c9c"} />}
      </div>

      <TableWrapper>
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
            {data.map((s, index) => (
              <TableRow
                key={s.id}
                className={clsx(
                  "text-neutrals-900",
                  index === 4 && "[&>td]:border-b-0"
                )}
              >
                <TableCell>{s.name}</TableCell>
                <TableCell>{s.code}</TableCell>
                <TableCell>{s.department}</TableCell>
                <TableCell>
                  {s.intended_stages.map((stage) => stage.name).join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </>
  );
}
