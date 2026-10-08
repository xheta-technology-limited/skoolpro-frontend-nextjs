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
import { ArrowRight3, Edit } from "iconsax-reactjs";

const headRow = [
  "Scale",
  "Min.Average",
  "Required Subject",
  "Attendance",
  "Action",
];
//TODO: Make this take in the content it's supposed to display
export default function PromotionRules() {
  return (
    <GradeItem
      label="Promotion Rules"
      subLabel="The academic gates used to recommend promotion. Scoped school / stage / level (most specific wins). These feed the eligibility check shown on each student’s result."
      buttonText="Add Rule"
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
                        alert("make this do whatever it's supposed to do")
                      }
                    >
                      <Edit
                        variant="Bulk"
                        size={12}
                        className="text-neutrals-800"
                      />
                      <Text
                        scale={"captionMobile"}
                        className="text-neutrals-700"
                      >
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
    </GradeItem>
  );
}
