"use client";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Text } from "@/components/ui";
import { Checkbox, CompactCheckbox, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import {
  CreateRoleFormData,
  createRoleSchema,
} from "@/features/role-management/schemas/create-role-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRole } from "@/features/role-management/api/create-role";
import { useListPermissions } from "@/features/role-management/api/list-permissions";
import { createSelectOptions } from "@/lib/helpers";
import { useState } from "react";

interface Props {
  defaults?: CreateRoleFormData & { subject_id?: string };
}
const AddRole = ({ defaults }: Props) => {
  const router = useProgressRouter();
  const methods = useForm<CreateRoleFormData>({
    defaultValues: defaults ? defaults : {},
    resolver: zodResolver(createRoleSchema),
  });
  const [searchFilter, setFilter] = useState("");
  const [permissionLength, setPermissionLength] = useState(0);
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("add-role") === "true";
  const handleClose = () =>
    router.replace("/super-admin/user-management/role-management");

  const { data: permissionsData, isPending: isPermissionsPending } =
    useListPermissions();

  const { mutate, isPending: isMutatePending } = useCreateRole();

  const onSubmit = () => {};

  return (
    <>
      <FormModal
        title={"Create New Role"}
        open={isOpen}
        onOpenChange={handleClose}
      >
        <FormProvider {...methods}>
          <form
            className="flex flex-col sm:h-auto gap-6 w-full"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4">
              <Input name="name" label="Enter role name" />
              <div className="gap-4 hidden md:flex items-center">
                <div className="flex-1">
                  <Input
                    name="filter"
                    label="Filter permissions, e.g fees"
                    value={searchFilter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>

                <Text
                  className="text-neutrals-700"
                  scale={"content"}
                >{`${permissionLength} selected`}</Text>
                <button className="py-2 px-3 border border-grays-borders rounded-[12px]">
                  <Text className="text-neutrals-700" scale={"content"}>
                    Clear
                  </Text>
                </button>
              </div>

              <Text
                scale={"content"}
                weight={"accent"}
                className="text-neutrals-700"
              >
                Assign permissions
              </Text>
              <div className="bg-primary-bg rounded-ml flex flex-col gap-4 p-2">
                {permissionsData?.modules.map((m) => (
                  <CompactCheckbox
                    key={m.key}
                    label={m.label}
                    name="permissions"
                    id={m.key}
                    value={m.key}
                  />
                ))}
              </div>
            </div>

            <div className="flex *:flex-1 gap-6">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                loading={isMutatePending}
                type="submit"
                size="lg"
                className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
              >
                {"Create role"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </FormModal>
    </>
  );
};

export default AddRole;
