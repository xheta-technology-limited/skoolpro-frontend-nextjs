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
import { ArrowRight3 } from "iconsax-reactjs";
import GradeItem from "../../_components/grade-item";
import { useMemo, useState } from "react";
import AddComponent from "./_components/add-component";
import { useGetGradingScheme } from "@/features/grade-scales/api/get-grading-scheme";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import { CreateGradingComponentFormData } from "@/features/grade-scales/schemas/create-grading-component-schema";

const headRow = ["No.", "Components", "Types", "Max", "Weight", "Action"];
export default function GradingScheme() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { schemeId } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const componentId = searchParams.get("component-id");
  const router = useProgressRouter();

  const { data, isPending, isRefetching, error, refetch } = useGetGradingScheme(
    (schemeId as string) ?? "",
    { enabled: !!schemeId, refetchOnWindowFocus: false }
  );

  const handleCloseModal = () => {
    setModalOpen(false);
    router.replace(pathname);
  };

  const defaults = useMemo<CreateGradingComponentFormData | undefined>(() => {
    if (!componentId) return undefined;
    const def = data?.components?.find((c) => c.id === componentId);
    if (!def) return undefined;
    return {
      name: def.name || "",
      assessment_type: def.assessment_type ?? undefined,
      code: def.code === null ? undefined : def.code,
      max_score: String(def.max_score),
      weight: String(def.weight),
    };
  }, [componentId, data]);

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
          subLabel="The weighted components. A subject total = Σ (raw ÷ max × weight). Weights should total 100% — if not, the scheme is blocked at grading time unless an authorised override is set."
          buttonText="Add Component"
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
          ) : data?.components?.length === 0 ? (
            <div className="mx-auto w-full">
              <NoData
                variant="search"
                title="No components for this scheme"
                subTitle={"Click the button above to add a component"}
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
                    {data?.components.map((component, index) => (
                      <TableRow key={component.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{titleCase(component.name)}</TableCell>
                        <TableCell>
                          {titleCase(component.assessment_type)}
                        </TableCell>
                        <TableCell>{component.max_score}</TableCell>
                        <TableCell>{`${component.weight}%`}</TableCell>
                        <TableCell>
                          <button
                            className="py-1.5 px-2 rounded-[12px] text-[0.75rem] flex items-center border border-grays-borders"
                            onClick={() => {
                              router.push(`?component-id=${component.id}`);
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

      <AddComponent
        handleClose={handleCloseModal}
        isOpen={isModalOpen}
        defaults={defaults}
      />
    </div>
  );
}
