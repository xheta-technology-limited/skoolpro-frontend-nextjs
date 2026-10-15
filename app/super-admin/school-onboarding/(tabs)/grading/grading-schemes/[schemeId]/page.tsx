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
import AddComponent from "./_components/add-component";

const headRow = ["No.", "Components", "Types", "Max", "Weight", "Action"];
export default function GradingScheme() {
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
          label="Scheme Name Here"
          subLabel="The weighted components. A subject total = Σ (raw ÷ max × weight). Weights should total 100% — if not, the scheme is blocked at grading time unless an authorised override is set."
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

      <AddComponent
        handleClose={() => setModalOpen(false)}
        isOpen={isModalOpen}
      />
    </div>
  );
}
