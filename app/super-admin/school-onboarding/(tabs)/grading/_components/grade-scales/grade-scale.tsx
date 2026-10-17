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
import { useProgressRouter } from "@/features/page-loader";
import { useListGradeScales } from "@/features/grade-scales/api/list-grade-scales";

const headRow = ["Scale", "Band", "Coverage", "Status", "Action"];
//TODO: Make this take in the content it's supposed to display
export default function GradeScale() {
  const router = useProgressRouter();

  const { data, isPending } = useListGradeScales({
    refetchOnWindowFocus: false,
  });

  return (
    <GradeItem
      label="Grade scales"
      subLabel="Each scale maps score ranges to grades. A school can keep several (senior WAEC, a junior A–E) and mark one the default. Open a scale to manage its bands."
      buttonText="Add Grade Scale"
      buttonFunc={() =>
        router.push(
          "/super-admin/school-onboarding/grading?add-grade-scale=true"
        )
      }
      isLoading={isPending}
    >
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
                  {data.map((scale, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {`${titleCase(scale.name)} `}
                        {scale.is_default && (
                          <span className="text-success-300">Default</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {titleCase(scale.bands[0]?.label || "") || "-"}
                      </TableCell>
                      <TableCell className="text-success-300">
                        {"Not provided by backend"}
                      </TableCell>
                      <TableCell>
                        {scale.is_active ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        <button
                          className="py-1.5 px-2 rounded-[12px] text-[0.75rem] flex items-center border border-grays-borders"
                          onClick={() =>
                            router.push(`grading/grade-scale/${scale.id}`)
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
          )}
        </div>
      )}
    </GradeItem>
  );
}
