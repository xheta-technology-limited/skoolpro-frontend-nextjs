"use client";

import { Text } from "@/components/ui";
import Header from "../_components/header";
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
import { SearchInput } from "@/components/ui/form/input";
import { Pagination } from "@/components/common";

export default function StaffManagement() {
  const exportStaff = () => alert("export clicked");
  const addStaff = () => alert("add clicked");
  const importStaff = () => alert("import clicked");
  const headRow = [
    "Name",
    "Email address",
    "Staff no.",
    "Category",
    "Department",
    "Employment",
    "Status",
  ];

  return (
    <div className="flex flex-col h-full">
      <Header
        role="staff"
        onExportClick={exportStaff}
        onAddClick={addStaff}
        onImportClick={importStaff}
      />

      <div className="rounded-tr-ml flex-1 overflow-auto">
        <div className="bg-white p-4 ">
          <Text className="block mb-8" weight={"standard"} scale={"highlight"}>
            Staff Management
          </Text>
          <div className="flex items-center gap-6">
            <SearchInput
              placeholder="Search name, email..."
              className="flex-1"
            />
            <Text
              scale={"caption"}
              className="text-neutrals-700"
            >{`Showing ${0} - ${0} of ${0}`}</Text>
          </div>
        </div>

        <Table className="m-0">
          <TableHeader className="[&>tr>th:first-child]:!rounded-none [&>tr>th:first-child]:!border-0 [&>tr>th:first-child]:!pl-4 [&>tr>th:last-child]:!rounded-none [&>tr>th:last-child]:!border-0 [&>tr>th:last-child]:!pr-4">
            <TableRow>
              {headRow.map((col, index) => {
                return (
                  <TableHead className={clsx("text-neutrals-700")} key={col}>
                    {col}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 30 }).map((undefined, index) => (
              <TableRow key={index}>
                <TableCell>Helen Diana</TableCell>
                <TableCell>helendiana@gmail.com</TableCell>
                <TableCell>EMP001</TableCell>
                <TableCell>Teaching</TableCell>
                <TableCell>Sciences</TableCell>
                <TableCell>Part Time</TableCell>
                <TableCell>
                  <StatusInfo status="green" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="overflow-hidden rounded-b-ml">
        <Pagination
          currentPage={3}
          totalItems={500}
          pageSize={14}
          onPageChange={() => alert("nope")}
        />
      </div>
    </div>
  );
}

interface StatusProps {
  status: string; //make this a union of the specific status strings
}
const StatusInfo = ({ status }: StatusProps) => {
  const colors =
    status === "green"
      ? "text-success-200 bg-[#EDFDFA]"
      : "bg-[#FDF6EC] text-warning-200";
  const details = status === "green" ? "Active" : "On leave";
  return (
    <Text
      as="span"
      scale="footnote"
      weight="standard"
      className={clsx("rounded-[12px] px-2.5 py-0.5", colors)}
    >
      {details}
    </Text>
  );
};
