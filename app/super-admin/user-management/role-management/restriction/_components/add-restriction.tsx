"use client";

import { MiniButton } from "@/components/common";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import FormModal from "@/components/ui/form-modal";
import { Input, SearchInput } from "@/components/ui/form/input";
import {
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useProgressRouter } from "@/features/page-loader";
import { useListPermissions } from "@/features/role-management/api/list-permissions";
import { formatPermission } from "@/features/role-management/helpers/formatPermission";
import { titleCase } from "@/lib/helpers";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AddRestriction() {
  const HEADROW = ["Current restrictions", "placeholder-content"];
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useProgressRouter();
  const dType = searchParams.get("deniable-type");
  const roleId = searchParams.get("role-id");
  const userId = searchParams.get("user-id");
  const name = searchParams.get("name");
  const title = searchParams.get("title");

  const isOpen =
    path.includes("/restriction") &&
    searchParams.get("add-restriction") === "true";

  const { data: perms, isPending: isPermsPending } = useListPermissions();

  // const filteredPerms = perms
  return (
    <FormModal
      open={isOpen}
      onOpenChange={() =>
        path.includes("/restriction/roles")
          ? router.replace(
              "/super-admin/user-management/role-management/restriction/roles"
            )
          : router.replace(
              "/super-admin/user-management/role-management/restriction/people"
            )
      }
      title={name}
      icon={
        <Text
          scale={"highlight"}
          className="text-neutrals-800"
          weight={"standard"}
        >
          {titleCase(title || "")}
        </Text>
      }
    >
      <div>
        <div className="rounded-ml bg-primary-bg p-2 border border-primary-100 mb-6">
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow>
                  {HEADROW.map((col, index) => {
                    const isMiddle = index != 0 && index != HEADROW.length - 1;
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
                {/* {allRoles.data?.map((r, index) =>  */}

                <TableRow key={""}>
                  <TableCell>{titleCase("poopydoopy") ?? "-"}</TableCell>
                  <TableCell>
                    <MiniButton>Revoke</MiniButton>
                  </TableCell>
                </TableRow>

                {/* )} */}
              </TableBody>
            </Table>
          </TableWrapper>
        </div>

        <div className="border border-grays-borders p-4 rounded-ml">
          <Text
            scale={"highlightMobile"}
            weight={"accent"}
            className="text-neutrals-800"
          >
            Add a restriction
          </Text>
          <Text scale={"contentMobile"} className="text-neutrals-700">
            It takes effect immediately and appears in the list above.
          </Text>
          <div className="h-4" />

          <div className="flex flex-col gap-6">
            <div>
              <Text
                scale={"highlightMobile"}
                weight={"standard"}
                className="text-neutrals-800 mb-2"
              >
                Permissions
              </Text>

              <SearchInput placeholder="Search permissions, e.g fees" />
            </div>

            {perms && (
              <div className="border border-grays-borders flex flex-col rounded-[8px] max-h-36 overflow-auto">
                {perms?.modules.map((p) => (
                  <>
                    {p.resources.map((r, idx) => (
                      <>
                        {r.permissions.map((per) => (
                          <div
                            key={`${per.key}-${p.key}`}
                            className="px-2 py-4 border-b border-b-grays-borders"
                          >
                            <Text
                              className="text-neutrals-800"
                              scale={"captionMobile"}
                            >
                              {formatPermission(per.key)}
                            </Text>
                          </div>
                        ))}
                      </>
                    ))}
                  </>
                ))}
              </div>
            )}

            <div>
              <Text
                as="span"
                scale={"highlightMobile"}
                weight={"standard"}
                className="text-neutrals-800 inline-block mb-2"
              >
                Reason
              </Text>{" "}
              <Text
                as="span"
                scale={"contentMobile"}
                className="text-neutrals-600"
              >
                (optional)
              </Text>
              <Input name="reason" label="Why is this being restricted?" />
            </div>

            <Button
              className="w-fit"
              onClick={() => alert("implement submitting")}
            >
              Add restriction
            </Button>
          </div>
        </div>
      </div>
    </FormModal>
  );
}
