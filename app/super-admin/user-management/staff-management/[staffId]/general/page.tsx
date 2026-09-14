"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { AddSquare, Edit, UserEdit } from "iconsax-reactjs";

import { qualifications, staff } from "./constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { useState } from "react";
import QualificationModal from "./_components/qualification-modal";
import ViewMode from "./_components/view-mode";
import EditMode from "./_components/edit-mode";

// Fallback helper — anything missing renders as "-"
const fallback = (value?: string) =>
  value && value.trim() !== "" ? value : "-";

const qualificationsHeadRow = [
  "Type",
  "Qualification",
  "Institution",
  "Awarded",
  "Grade",
  "Reg No.",
  "Expires",
  "Action",
];

export default function ProfilePage() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  return (
    <>
      <QualificationModal
        open={isModalOpen}
        onOpenChange={() => setModalOpen(false)}
      />
      <div className="flex flex-col gap-8 w-full">
        {isEditMode ? (
          <EditMode setEditMode={setEditMode} />
        ) : (
          <ViewMode setEditMode={setEditMode} />
        )}

        {/* Qualifications */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Text className="text-neutrals-700">QUALIFICATIONS</Text>
            <Button
              variant="secondary"
              onClick={() => {
                setModalOpen(true);
              }}
              size="sm"
              leftIcon={
                <AddSquare variant="Bulk" size={16} className="text-primary" />
              }
            >
              Add
            </Button>
          </div>

          <div className="rounded-ml bg-primary-bg p-2">
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow>
                    {qualificationsHeadRow.map((col, index) => {
                      const isMiddle =
                        index != 0 && index != qualificationsHeadRow.length - 1;
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
                  {qualifications.map((qual) => (
                    <TableRow key={qual.id}>
                      <TableCell>{fallback(qual.type)}</TableCell>
                      <TableCell>{fallback(qual.qualification)}</TableCell>
                      <TableCell className="truncate max-w-30">
                        {fallback(qual.institution)}
                      </TableCell>
                      <TableCell>{fallback(qual.awarded)}</TableCell>
                      <TableCell>{fallback(qual.grade)}</TableCell>
                      <TableCell>{fallback(qual.regNo)}</TableCell>
                      <TableCell>{fallback(qual.expires)}</TableCell>
                      <TableCell>
                        <button className="border-grays-borders text-neutrals-700 px-2 py-1.5 border flex gap-1 items-center rounded-[12px]">
                          <Edit
                            size={14}
                            variant="Bulk"
                            className="text-neutrals-800"
                          />
                          <Text scale={"caption"} className="text-neutrals-700">
                            Edit
                          </Text>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </div>
        </div>

        <div className="flex gap-6 *:flex-1">
          <Button variant="secondary" onClick={() => alert("Not implemented")}>
            Suspend user
          </Button>
          <Button onClick={() => alert("Not implemented")}>
            Disable user account
          </Button>
        </div>

        <Button variant="tertiary" className="m-auto">
          <Text scale={"highlight"} className="text-error-200">
            Delete user account
          </Text>
        </Button>
      </div>
    </>
  );
}
