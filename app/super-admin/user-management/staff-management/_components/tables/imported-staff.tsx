"use client";
import { StatusBadge } from "@/components/common";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import clsx from "clsx";
interface Props {
  dataToMap: any[];
}
export default function ImportedTable({ dataToMap }: Props) {
  const columns = ["Name", "Staff no.", "Category", "Status", "Details"];
  return (
    <>
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
            {dataToMap.map((staff, index) => (
              <TableRow
                key={staff.id}
                className={clsx(
                  "text-neutrals-900",
                  index === 4 && "[&>td]:border-b-0"
                )}
              >
                <TableCell>{titleCase(staff.name) || "-"}</TableCell>
                <TableCell>{staff.staff_number || "-"}</TableCell>
                <TableCell>{staff.category || "-"}</TableCell>
                <TableCell>
                  <StatusBadge variant="green" data="Valid" />
                </TableCell>
                <TableCell>{staff.details || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </>
  );
}
