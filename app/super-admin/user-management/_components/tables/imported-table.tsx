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
import { ImportRecord } from "@/features/user-management/types/api/template";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import clsx from "clsx";
interface Props<T extends Record<string, string>> {
  dataToMap: Partial<ImportRecord<T>>;
  columns: string[];
  keys: string[];
}
export default function ImportedTable<T extends Record<string, string>>({
  dataToMap,
  columns,
  keys,
}: Props<T>) {
  if (!dataToMap) {
    return null;
  }
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

          {dataToMap.rows && dataToMap.rows.length > 0 && (
            <TableBody>
              {dataToMap.rows?.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={clsx(
                    "text-neutrals-900",
                    index === 4 && "[&>td]:border-b-0"
                  )}
                >
                  <TableCell>
                    {titleCase(
                      `${row.mapped_data?.first_name} ${row.mapped_data?.last_name} ${row.mapped_data?.middle_name}`
                    ) || "-"}
                  </TableCell>
                  <TableCell>{row.mapped_data?.[keys[0]] || "-"}</TableCell>
                  <TableCell>
                    {titleCase(row.mapped_data?.[keys[1]] || "") || "-"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={row.errors ? "orange" : "green"}
                      data={row.errors ? titleCase(row.status) : "Valid"}
                    />
                  </TableCell>
                  <TableCell>{titleCase(row.status) || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableWrapper>
    </>
  );
}
