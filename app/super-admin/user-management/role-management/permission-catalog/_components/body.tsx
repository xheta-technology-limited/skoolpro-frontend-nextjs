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
import { useState } from "react";

const HEADROW = ["Resources", "Action", "No."];
export default function Body() {
  const [searchFilter, setSearchFilter] = useState("");
  const { data, isPending, error, isError, isRefetching, refetch } =
    useListPermissions({
      refetchOnWindowFocus: true,
    });

  const normalizedFilter = searchFilter.trim().toLowerCase();
  const filteredModules =
    data?.modules
      .map((module) => {
        const moduleMatches =
          module.label.toLowerCase().includes(normalizedFilter) ||
          module.key.toLowerCase().includes(normalizedFilter);

        if (moduleMatches) return module;

        return {
          ...module,
          resources: module.resources
            .map((resource) => ({
              ...resource,
              permissions: resource.permissions.filter((permission) =>
                `${permission.key} ${permission.label}`
                  .toLowerCase()
                  .includes(normalizedFilter)
              ),
            }))
            .filter((resource) => resource.permissions.length > 0),
        };
      })
      .filter((module) => module.resources.length > 0) ?? [];

  const filteredPermissionCount = filteredModules.reduce(
    (moduleSum, module) =>
      moduleSum +
      module.resources.reduce(
        (resourceSum, resource) => resourceSum + resource.permissions.length,
        0
      ),
    0
  );

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
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <Text
          className="text-neutrals-700 hidden md:block"
          scale={"captionMobile"}
        >{`${filteredPermissionCount} of ${data.total} permissions · ${filteredModules.length} modules`}</Text>
      </div>

      <div className="flex flex-col gap-4">
        {filteredModules.length === 0 ? (
          <Text scale={"captionMobile"} className="text-neutrals-500">
            No permissions found
          </Text>
        ) : (
          filteredModules.map((m) => (
            <div key={m.key}>
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
                                  key={p.key}
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
          ))
        )}
      </div>
    </>
  );
}
