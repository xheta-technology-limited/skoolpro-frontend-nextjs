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
import { useEffect, useMemo, useState } from "react";
import AddBand from "./_components/add-band";
import { useGetGradeScale } from "@/features/grade-scales/api/get-grade-scale";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import { CreateBandFormData } from "@/features/grade-scales/schemas/create-band-schema";

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
  const [isModalOpen, setModalOpen] = useState(false);
  const { gradeId } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const bandId = searchParams.get("band-id");
  const router = useProgressRouter();

  const { data, isPending, isRefetching, error, refetch } = useGetGradeScale(
    (gradeId as string) ?? "",
    { enabled: !!gradeId, refetchOnWindowFocus: false }
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    router.replace(pathname);
  };

  const defaults = useMemo(() => {
    if (!bandId) return undefined;
    const def = data?.bands?.find((b) => b.id === bandId);
    if (!def) return undefined;
    return {
      comment: def?.comment === null ? undefined : def?.comment,
      description: def?.description === null ? undefined : def?.description,
      grade_point:
        def.grade_point === undefined
          ? def.grade_point
          : String(def.grade_point),
      label: def?.label || "",
      min_score: String(def?.min_score),
      max_score: String(def?.max_score),
      is_pass: def.is_pass,
    };
  }, [bandId, data]);

  return (
    <div>
      <BackButton
        variant="sm"
        label="Grade Scale"
        url="/super-admin/school-onboarding/grading"
      />
      <div className="h-6" />
      <div className=" bg-white p-6 rounded-[32px] md:min-h-[calc(100vh-230px)]">
        <GradeItem
          isLoading={isRefetching}
          label={data?.name || "-"}
          subLabel="The bands of this scale. Add, edit or remove bands — the system checks they don’t overlap and warns on gaps. Ranges are inclusive at both ends."
          buttonText="Add Band"
          buttonFunc={() => setModalOpen(true)}
        >
          {isPending ? (
            <div className="w-full flex items-center justify-center py-7">
              <Spinner size={70} />
            </div>
          ) : error ? (
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
                loading={isRefetching}
                onClick={() => refetch()}
                size="lg"
              >
                Retry
              </Button>
            </div>
          ) : data?.bands?.length === 0 ? (
            <div className="mx-auto w-full">
              <NoData
                variant="search"
                title="No bands for this grade scale"
                subTitle={"Click the button above to add a band"}
                className="w-97.5 h-143.75 mx-auto"
              />
            </div>
          ) : (
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
                    {data?.bands.map((b, index) => (
                      <TableRow key={index}>
                        <TableCell>{titleCase(b.label) || ""}</TableCell>
                        <TableCell>{b.min_score}</TableCell>
                        <TableCell>{b.max_score}</TableCell>
                        <TableCell>{b.grade_point}</TableCell>
                        <TableCell>{b.description}</TableCell>
                        <TableCell
                          style={{
                            color: b.is_pass ? "#0b7b69" : "#CC7914",
                          }}
                        >
                          {b.is_pass ? "Pass" : "Fail"}
                        </TableCell>
                        <TableCell>
                          <button
                            className="py-1.5 px-2 rounded-[12px] text-[0.75rem] flex items-center border border-grays-borders"
                            onClick={() => {
                              router.push(`?band-id=${b.id}`);
                              setModalOpen(true);
                            }}
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
          )}
        </GradeItem>
      </div>

      <AddBand
        handleClose={handleCloseModal}
        isOpen={isModalOpen}
        defaults={defaults}
      />
    </div>
  );
}
