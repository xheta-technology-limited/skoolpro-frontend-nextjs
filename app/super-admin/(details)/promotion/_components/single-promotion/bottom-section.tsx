"use client";
import { Spinner } from "@/components/animations";
import { MiniBadge, MiniSelector } from "@/components/common";
import { NoData } from "@/components/icons";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@/components/ui/table";
import { ClassSection } from "@/features/academic-year";
import {
  listClassSections,
  useListClassSections,
} from "@/features/academic-year/api/list-class-sections";
import { useCommitPromotion } from "@/features/promotion/api/commit-promotion";
import { useGetPromotionDetails } from "@/features/promotion/api/get-promotion-details";
import { CommitPromotionFormData } from "@/features/promotion/schemas/commit-promotion-schema";
import { Promotion } from "@/features/promotion/types/api/promotion";
import { PromotionDisposition } from "@/features/promotion/types/api/promotion-details";
import { useGetClassSections } from "@/features/user-management/student-management/api/get-class-sections";
import { createSelectOptions, titleCase } from "@/lib/helpers";
import { useParams } from "next/navigation";
import { useState } from "react";

interface Props {
  data: Promotion;
}

const committedHeaders = ["Outcome", "Students", "Effect"];
const notCommittedHeaders = [
  "Name",
  "This year",
  "Proposed",
  "Next year",
  "Decision",
];

const cellValue = (...parts: (string | null | undefined)[]) => {
  const value = parts.filter(Boolean).join(" · ");
  return value || "-";
};
export default function BottomSection({ data }: Props) {
  return (
    <>
      {data.status === "committed" ? (
        <CommittedTable data={data} />
      ) : (
        <NotCommitted data={data} />
      )}
    </>
  );
}

function CommittedTable({ data }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                {committedHeaders.map((col, index) => {
                  const isMiddle =
                    index != 0 && index != committedHeaders.length - 1;
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
              <TableRow>
                <TableCell>
                  <Text scale={"caption"} className="text-success-300">
                    Promoted
                  </Text>
                </TableCell>
                <TableCell>{data.counts.promoted}</TableCell>
                <TableCell></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Text scale={"caption"} className="text-[#6155F5]">
                    Graduated
                  </Text>
                </TableCell>
                <TableCell>{data.counts.graduated}</TableCell>
                <TableCell></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Text scale={"caption"} className="text-[#0088FF]">
                    Repeated
                  </Text>
                </TableCell>
                <TableCell>{data.counts.repeated}</TableCell>
                <TableCell></TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Text scale={"caption"} className="text-secondary-800">
                    Need placement
                  </Text>
                </TableCell>
                <TableCell>{data.counts.repeated}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableWrapper>
      </div>
    </div>
  );
}

function NotCommitted({ data }: Props) {
  const params = useParams<{ promotionId: string }>();
  const pID = params.promotionId;
  const {
    data: singleData,
    isPending,
    error,
    refetch,
    isFetching,
  } = useGetPromotionDetails(pID, { refetchOnWindowFocus: false });
  const { mutate, isPending: isMutatePending } = useCommitPromotion();

  const getColor = {
    promote: "#0B7B69",
    graduate: "#6155F5",
    repeat: "#C18800",
    hold: "#C18800",
  };

  const dispositionOptions: { value: PromotionDisposition; label: string }[] = [
    { value: "promote", label: "Promote" },
    { value: "graduate", label: "Graduates" },
    { value: "hold", label: "Hold" },
    { value: "repeat", label: "Repeat" },
  ];

  const { data: classes, isPending: isClassesPending } = useListClassSections();
  const classesOptions = createSelectOptions<ClassSection, "id", "code">(
    classes,
    "id",
    "code"
  );

  const [decisions, setDecisions] = useState<
    CommitPromotionFormData["decisions"]
  >({});
  const payload: CommitPromotionFormData = { decisions };
  const onCommit = () => {
    mutate({ promotionId: pID, data: payload });
  };

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-fit mx-auto">
        {" "}
        <NoData
          variant="signal"
          title="Something went Wrong"
          subTitle={error.message || ""}
          className="w-97.5 h-143.75"
        />
        <Button
          className="mt-3 w-full"
          loading={isFetching}
          onClick={() => refetch()}
          size="lg"
        >
          Retry
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-ml bg-primary-bg p-6 border border-primary-100">
        <TableWrapper>
          <Table>
            <TableHeader>
              <TableRow>
                {notCommittedHeaders.map((col, index) => {
                  const isMiddle =
                    index != 0 && index != notCommittedHeaders.length - 1;
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
              {singleData?.data.map((row, index) => (
                <TableRow key={row.student_id}>
                  <TableCell>
                    {cellValue(titleCase(row.student_name))}
                  </TableCell>
                  <TableCell>
                    {cellValue(
                      row.current_level,
                      titleCase(row.current_section ?? "")
                    )}
                  </TableCell>
                  <TableCell>
                    <Text
                      scale={"caption"}
                      className={`text-[${getColor[row.disposition]}]`}
                    >
                      {row.needs_placement
                        ? "Needs placement"
                        : titleCase(row.disposition)}
                    </Text>
                  </TableCell>
                  <TableCell>
                    {cellValue(
                      row.target_level,
                      titleCase(row.target_section ?? "")
                    )}
                  </TableCell>

                  {row.needs_placement ? (
                    <TableCell>
                      <MiniSelector
                        disabled={isClassesPending}
                        onValueChange={(value) =>
                          setDecisions((prev) => ({
                            ...prev,
                            [row.student_id]: {
                              target_section_id: value as string,
                            },
                          }))
                        }
                        value={"Choose class"}
                        items={classesOptions || []}
                      />
                    </TableCell>
                  ) : (
                    <TableCell>
                      {row.disposition !== "graduate" ? (
                        <MiniSelector
                          onValueChange={(value) =>
                            setDecisions((prev) => ({
                              ...prev,
                              [row.student_id]: {
                                disposition: value as PromotionDisposition,
                              },
                            }))
                          }
                          value={
                            decisions[row.student_id]?.disposition ??
                            row.disposition
                          }
                          items={dispositionOptions}
                        />
                      ) : (
                        <MiniBadge data="Graduates" />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      </div>

      <div className="flex gap-5 self-end">
        <Button
          onClick={() => alert("Not implemented")}
          disabled={data.status === "discarded"}
          variant="secondary"
          size="md"
        >
          Discard Run
        </Button>
        <Button onClick={onCommit} loading={isMutatePending} size="md">
          Commit Propmotion
        </Button>
      </div>
    </div>
  );
}
