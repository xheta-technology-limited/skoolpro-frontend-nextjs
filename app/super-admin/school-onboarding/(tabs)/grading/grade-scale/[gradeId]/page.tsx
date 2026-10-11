"use client";
import { BackButton } from "@/components/common";
import { Text } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { titleCase } from "@/lib/helpers";
import { AddSquare, ArrowRight3 } from "iconsax-reactjs";
import GradeItem from "../../_components/grade-item";
import { useState } from "react";
import AddBand from "./_components/add-band";

const headRow = [
  "Grade",
  "Minimum",
  "Maximum",
  "Point",
  "Description",
  "Pass",
  "Action",
];
export default function GradeScale() {
  const passOrFail: "pass" | "fail" = "pass";
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div>
      <BackButton
        variant="sm"
        label="Grade Scale"
        url="/super-admin/school-onboarding/grading"
      />
      <div className="h-6" />
      <div className=" bg-white p-6 rounded-[32px] md:h-[calc(100vh-230px)]">
        <GradeItem
          isLoading
          label="Senior (WAEC A1–F9)"
          subLabel="The bands of this scale. Add, edit or remove bands — the system checks they don’t overlap and warns on gaps. Ranges are inclusive at both ends."
          buttonText="Add Band"
          buttonFunc={() => setModalOpen(true)}
        >
          <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
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
                  {Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>{titleCase("sum stuff")}</TableCell>
                      <TableCell>{"sum other stuff"}</TableCell>
                      <TableCell>{"ANOTHER stuff"}</TableCell>
                      <TableCell>{titleCase("omg more stuff wow")}</TableCell>
                      <TableCell>{titleCase("omg more stuff wow")}</TableCell>
                      <TableCell
                        style={{
                          color: passOrFail === "pass" ? "#0b7b69" : "#CC7914",
                        }}
                      >
                        {titleCase("omg more stuff wow")}
                      </TableCell>
                      <TableCell>
                        <button
                          className="py-1.5 px-2 rounded-[12px] text-[0.75rem] flex items-center border border-grays-borders"
                          onClick={() =>
                            alert("make this navigate to the right place")
                          }
                        >
                          <Text
                            scale={"captionMobile"}
                            className="text-neutrals-700"
                          >
                            Edit
                          </Text>
                          <ArrowRight3
                            variant="Bulk"
                            size={12}
                            className="text-neutrals-800"
                          />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </div>
        </GradeItem>
      </div>

      <AddBand handleClose={() => setModalOpen(false)} isOpen={isModalOpen} />
    </div>
  );
}
