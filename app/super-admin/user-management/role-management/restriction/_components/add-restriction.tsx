"use client";

import { Spinner } from "@/components/animations";
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
import { useAddRestriction } from "@/features/role-management/api/add-restriction";
import { useDeleteRestriction } from "@/features/role-management/api/delete-restriction";
import { useListPermissions } from "@/features/role-management/api/list-permissions";
import { useListRestrictions } from "@/features/role-management/api/list-restrictions";
import { restrictionKeys } from "@/features/role-management/api/query-keys";
import { formatPermission } from "@/features/role-management/helpers/formatPermission";
import {
  addRestrictionSchema,
  type AddRestrictionFormData,
} from "@/features/role-management/schemas/add-restriction-schema";
import { titleCase } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

type AddRestrictionFormProps = {
  dType: string;
  denyableId: string;
};

function AddRestrictionForm({ dType, denyableId }: AddRestrictionFormProps) {
  const queryClient = useQueryClient();
  const { data: restrictions, isRefetching: isRestrictionsRefetching } =
    useListRestrictions(dType, denyableId, {
      refetchOnWindowFocus: false,
      enabled: !!dType && !!denyableId,
    });

  const HEADROW = [
    "Current restrictions",
    `${restrictions?.length ?? 0} restrictions`,
  ];

  const { data: perms } = useListPermissions();
  const addRestriction = useAddRestriction();
  const deleteRestriction = useDeleteRestriction();

  const [search, setSearch] = useState("");
  const [selectedPermission, setSelectedPermission] = useState<string | null>(
    null
  );
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const form = useForm<AddRestrictionFormData>({
    resolver: zodResolver(addRestrictionSchema),
    defaultValues: {
      denyable_type: dType,
      denyable_id: denyableId,
      permission: "",
      reason: "",
    },
  });

  const filteredModules = useMemo(() => {
    if (!perms) return [];
    const q = search.trim().toLowerCase();
    if (!q) return perms.modules;

    return perms.modules
      .map((m) => ({
        ...m,
        resources: m.resources
          .map((r) => ({
            ...r,
            permissions: r.permissions.filter((per) => {
              const label = formatPermission(per.key).toLowerCase();
              return per.key.toLowerCase().includes(q) || label.includes(q);
            }),
          }))
          .filter((r) => r.permissions.length > 0),
      }))
      .filter((m) => m.resources.length > 0);
  }, [perms, search]);

  const handleSelectPermission = (key: string) => {
    setSelectedPermission(key);
    form.setValue("permission", key, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = form.handleSubmit((data) => {
    addRestriction.mutate(data, {
      onSuccess: () => {
        toast.success("Restriction added"),
          queryClient.invalidateQueries({ queryKey: restrictionKeys.all });
        form.reset({
          denyable_type: dType,
          denyable_id: denyableId,
          permission: "",
          reason: "",
        });
        setSelectedPermission(null);
      },
    });
  });

  const handleRevoke = (id: string) => {
    setRevokingId(id);
    deleteRestriction.mutate(
      { id },
      {
        onSettled: () => setRevokingId(null),
        onSuccess: () => toast.success("Revoked successfullly"),
      }
    );
  };

  return (
    <div>
      {restrictions && restrictions.length > 0 && (
        <>
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
                        <TableHead
                          style={{
                            textAlign: index === 1 ? "right" : undefined,
                          }}
                          className={style}
                          key={col}
                        >
                          {col}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {restrictions.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Text
                          as="span"
                          scale={"contentMobile"}
                          className="text-neutrals-900"
                        >
                          {formatPermission(r.permission)}
                        </Text>
                        <br />
                        {r.reason && (
                          <Text
                            as="span"
                            scale={"captionMobile"}
                            className="text-neutrals-600"
                          >
                            {r.reason}
                          </Text>
                        )}
                        <br />
                        <Text as="span" scale={"footnote"}>
                          {r.created_by && (
                            <span>{titleCase(r.created_by.name || "")}</span>
                          )}
                          {r.created_at && r.created_by && <span> · </span>}
                          {r.created_at && (
                            <span>
                              {new Date(r.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          )}
                        </Text>
                      </TableCell>
                      <TableCell className="text-right">
                        <MiniButton
                          loading={revokingId === r.id}
                          onClick={() => handleRevoke(r.id)}
                        >
                          Revoke
                        </MiniButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </div>
          {isRestrictionsRefetching && <Spinner size={14} color="#726C6C" />}
          <div className="h-6" />
        </>
      )}

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

        <FormProvider {...form}>
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div>
              <Text
                scale={"highlightMobile"}
                weight={"standard"}
                className="text-neutrals-800 mb-2"
              >
                Permissions
              </Text>

              <SearchInput
                placeholder="Search permissions, e.g fees"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {perms && (
              <div className="border border-grays-borders flex flex-col rounded-[8px] max-h-36 overflow-auto">
                {filteredModules.map((p) => (
                  <Fragment key={p.key}>
                    {p.resources.map((r) => (
                      <Fragment key={r.key}>
                        {r.permissions.map((per) => (
                          <button
                            type="button"
                            key={`${p.key}-${r.key}-${per.key}`}
                            onClick={() => handleSelectPermission(per.key)}
                            className={clsx(
                              "px-2 py-4 border-b border-b-grays-borders text-left",
                              selectedPermission === per.key && "bg-primary-bg"
                            )}
                          >
                            <Text
                              className="text-neutrals-800"
                              scale="captionMobile"
                            >
                              {formatPermission(per.key)}
                            </Text>
                          </button>
                        ))}
                      </Fragment>
                    ))}
                  </Fragment>
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
              type="submit"
              className="w-fit"
              loading={addRestriction.isPending}
              disabled={!selectedPermission || addRestriction.isPending}
            >
              Add restriction
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default function AddRestriction() {
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

  const denyableId = userId || roleId || "";
  const closePath = path.includes("/restriction/roles")
    ? "/super-admin/user-management/role-management/restriction/roles"
    : "/super-admin/user-management/role-management/restriction/people";

  return (
    <FormModal
      open={isOpen}
      onOpenChange={() => router.replace(closePath)}
      title={titleCase(name || "")}
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
      {isOpen && (
        <AddRestrictionForm
          key={`${dType ?? ""}:${denyableId}`}
          dType={dType || ""}
          denyableId={denyableId}
        />
      )}
    </FormModal>
  );
}
