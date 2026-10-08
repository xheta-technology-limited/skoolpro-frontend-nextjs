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
import GradeItem from "../grade-item";
import { titleCase } from "@/lib/helpers";
import { Text } from "@/components/ui";
import { ArrowRight3 } from "iconsax-reactjs";

const headRow = ["Scheme", "Scope", "Component", "Weight", "Action"];
//TODO: Make this take in the content it's supposed to display
export default function GradingSchemes() {
  return (
    <GradeItem
      label="Grading schemes"
      subLabel="A scheme is the set of weighted assessments a subject total is built from. One school-wide default, with optional overrides per level or per subject. Open one to manage its components."
      buttonText="Add Scheme"
      buttonFunc={() => alert("not implemented")}
      isLoading
    >
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
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>{titleCase("sum stuff")}</TableCell>
                  <TableCell>{"sum other stuff"}</TableCell>
                  <TableCell className="text-success-300">
                    {"ANOTHER stuff"}
                  </TableCell>
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
                        Open
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
  );
}
