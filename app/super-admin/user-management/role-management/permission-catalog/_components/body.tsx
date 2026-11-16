"use client";
import { SearchInput } from "@/components/ui/form/input";
import { useListPermissions } from "@/features/role-management/api/list-permissions";
import { Text } from "@/components/ui";
import { NoData } from "@/components/icons";
import { Button } from "@/components/ui/custom-button";
import { Spinner } from "@/components/animations";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { titleCase } from "@/lib/helpers";

const HEADROW = ["Resources", "Action", "No."];
export default function Body() {
  const { data, isPending, error, isError, isRefetching, refetch } =
    useListPermissions({
      refetchOnWindowFocus: true,
    });

  if (isPending) {
    return (
      <>
        <div className="w-full flex items-center justify-center py-7">
          <Spinner size={70} />
        </div>
      </>
    );
  }
  if (isError) {
    return (
      <div className="w-fit mx-auto">
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
    );
  }
  return (
    <>
      <div className="flex items-center gap-6 mb-8">
        <SearchInput
          className="flex-1"
          placeholder="Search permissions, e.g fees..."
        />
        {/* TODO: PUT THE FILTERED LENGTH HERE */}
        <Text scale={"captionMobile"}>{`${0} of ${0} permissions · ${
          data?.modules.length
        } modules`}</Text>
      </div>

      <div className="flex flex-col gap-4">
        {data.modules.map((m) => (
          <div>
            <div className="bg-white rounded-t-ml border-grays-borders border px-4 py-2.5 flex justify-between mb-2">
              <Text
                scale={"captionMobile"}
                weight={"accent"}
                className="text-neutrals-700"
              >
                {m.label}
              </Text>

              <Text
                scale={"captionMobile"}
                className="text-neutrals-700"
              >{`${m.resources.length} permissions`}</Text>
            </div>

            <div className="rounded-ml bg-primary-bg p-2 border border-primary-100">
              <TableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {HEADROW.map((col, index) => {
                        const isMiddle =
                          index != 0 && index != HEADROW.length - 1;
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
                    {m.resources.map((r, index) => (
                      <TableRow key={index}>
                        <TableCell>{titleCase(r.label) ?? "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {r.permissions.map((p) => (
                              <Text
                                scale={"captionMobile"}
                                className="border border-grays-borders rounded-[8px] py-2 px-3"
                              >
                                {p.label}
                              </Text>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{r.permissions.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableWrapper>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
