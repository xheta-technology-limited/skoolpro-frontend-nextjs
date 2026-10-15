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
import { headRow, badges } from "./constants";
import { useProgressRouter } from "@/features/page-loader";
import { useListPassMarks } from "@/features/grade-scales/api/list-pass-marks";
import AddPassMark from "../modals/add-pass-mark";
import { useState } from "react";

//TODO: Make this take in the content it's supposed to display
export default function PassMark() {
  const router = useProgressRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const { data, isPending } = useListPassMarks({
    refetchOnWindowFocus: false,
  });

  const openModal = () => setModalOpen(true);

  return (
    <GradeItem
      label="Pass mark"
      subLabel="The score a student must reach to pass. Set at four scopes; the most specific one applies. If none is set, pass/fail falls back to the grade band."
      buttonText="Set Pass Mark"
      buttonFunc={openModal}
      isLoading={isPending}
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
          The subject pass mark lives on the subject itself (set in the
          Curriculum module), so it isn’t added here. This screen manages the
          other three.
        </Text>
      </div>
      {!data ? (
        <></>
      ) : (
        <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
          {data.length === 0 ? (
            <></>
          ) : (
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
                  {data.map((passMark, index) => (
                    <TableRow key={passMark.id ?? index}>
                      <TableCell
                        style={{
                          color:
                            passMark.scope_type === "programme"
                              ? "#CC7914"
                              : passMark.scope_type === "class"
                              ? "#0088FF"
                              : undefined,
                        }}
                      >
                        {titleCase(passMark.scope_type)}
                      </TableCell>
                      <TableCell className="text-success-300">{"-"}</TableCell>
                      <TableCell>{passMark.pass_mark}</TableCell>
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
          )}
          <AddPassMark
            isOpen={isModalOpen}
            handleClose={() => setModalOpen(false)}
          />
        </div>
      )}
    </GradeItem>
  );
}

const badgeColors: Record<string, { bg: string; text: string }> = {
  Class: { bg: "#6155F51A", text: "#6155F5" },
  Subject: { bg: "#0088FF1A", text: "#0088FF" },
  "Program (stage)": { bg: "#FEE6D180", text: "#EDA145" },
  "General (school)": { bg: "#E3E3E3", text: "#433E3F" },
};

const Badge = ({ label }: { label: string }) => {
  const colors = badgeColors[label];

  return (
    <div
      className="px-2.5 py-0.5 rounded-[12px]"
      style={{ backgroundColor: colors?.bg }}
    >
      <Text
        style={{ color: colors?.text }}
        scale={"captionMobile"}
      >{`${label}`}</Text>
    </div>
  );
};
