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
import clsx from "clsx";
import { headRow, badges } from "./constants";

//TODO: Make this take in the content it's supposed to display
export default function PassMark() {
  return (
    <GradeItem
      label="Pass mark"
      subLabel="The score a student must reach to pass. Set at four scopes; the most specific one applies. If none is set, pass/fail falls back to the grade band."
      buttonText="Set Pass Mark"
      buttonFunc={() => alert("not implemented")}
      isLoading
    >
      <div className="mb-8 py-6 px-4 flex flex-col gap-2 border border-grays-borders rounded-ml">
        <Text scale={"highlightMobile"} className="text-neutrals-800">
          Resolution order
        </Text>

        <div className="flex gap-2">
          {badges.map((t, index) => (
            <div className="flex items-center gap-2" key={index}>
              <Badge label={t} />
              {index < 3 && (
                <ArrowRight3
                  variant="Bulk"
                  size={12}
                  className="text-neutrals-800"
                />
              )}
            </div>
          ))}
        </div>

        <Text scale={"contentMobile"}>
          The subject pass mark lives on the subject itself (set in the
          Curriculum module), so it isn’t added here. This screen manages the
          other three.
        </Text>
      </div>
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

const Badge = ({ label }: { label: string }) => {
  const bgColor =
    label === "Class"
      ? "#6155F51A"
      : label === "Subject"
      ? "#0088FF1A"
      : label === "Program (stage)"
      ? "#FEE6D180"
      : label === "General (school)"
      ? "#E3E3E3"
      : "";

  const textColor =
    label === "Class"
      ? "#6155F5"
      : label === "Subject"
      ? "#0088FF"
      : label === "Program (stage)"
      ? "#EDA145"
      : label === "General (school)"
      ? "#433E3F"
      : "";

  const style = `text-[${textColor}] bg-[${bgColor}]`;

  return (
    <div className={clsx(`px-2.5 py-0.5 rounded-[12px]`, style)}>
      <Text scale={"captionMobile"}>{`${label}`}</Text>
    </div>
  );
};
