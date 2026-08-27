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
import clsx from "clsx";

const columns = ["Subject", "Code", "Department", "Stages"];
export default function CatalogTable() {
  //call api here
  //return spinner if loading
  return (
    <>
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
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                key={index}
                className={clsx(
                  "text-neutrals-900",
                  index === 4 && "[&>td]:border-b-0"
                )}
              >
                <TableCell>English</TableCell>
                <TableCell>ENG</TableCell>
                <TableCell>All</TableCell>
                <TableCell>All</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </>
  );
}
