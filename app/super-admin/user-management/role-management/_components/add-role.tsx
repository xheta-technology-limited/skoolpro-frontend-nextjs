"use client";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useSearchParams } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Text } from "@/components/ui";
import { CompactCheckbox, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import {
  CreateRoleFormData,
  createRoleSchema,
} from "@/features/role-management/schemas/create-role-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateRole } from "@/features/role-management/api/create-role";
import { useUpdateRole } from "@/features/role-management/api/update-role";
import { useGetRole } from "@/features/role-management/api/get-role";
import { useListPermissions } from "@/features/role-management/api/list-permissions";
import { Spinner } from "@/components/animations";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const AddRole = () => {
  const router = useProgressRouter();
  const methods = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
  });
  const [searchFilter, setFilter] = useState("");
  const searchParams = useSearchParams();
  const editRoleId = searchParams.get("edit-role");
  const isEdit = !!editRoleId;
  const isOpen = isEdit || searchParams.get("add-role") === "true";

  const handleClose = () => {
    methods.reset();
    setFilter("");
    router.replace("/super-admin/user-management/role-management");
  };

  const selectedPermissions = useWatch({
    control: methods.control,
    name: "permissions",
  });
  const permissionLength = Array.isArray(selectedPermissions)
    ? selectedPermissions.length
    : selectedPermissions
    ? 1
    : 0;

  const { data: permissionsData, isPending: isPermissionsPending } =
    useListPermissions();
  const { data: roleData, isPending: isRolePending } = useGetRole(
    editRoleId ?? "",
    {
      enabled: isEdit,
    }
  );

  const { mutate: createRole, isPending: isCreatePending } = useCreateRole();
  const { mutate: updateRole, isPending: isUpdatePending } = useUpdateRole();
  const isMutatePending = isEdit ? isUpdatePending : isCreatePending;

  useEffect(() => {
    if (!isOpen) return;

    methods.reset(
      isEdit && roleData
        ? { name: roleData.name, permissions: roleData.permissions }
        : { name: "", permissions: [] }
    );
  }, [isOpen, isEdit, roleData, methods]);

  const onSubmit = (data: CreateRoleFormData) => {
    const onSuccess = () => {
      toast.success(isEdit ? "Role updated" : "Role created");
      handleClose();
    };

    if (editRoleId) {
      updateRole({ id: editRoleId, data }, { onSuccess });
    } else {
      createRole(data, { onSuccess });
    }
  };

  const normalizedFilter = searchFilter.trim().toLowerCase();
  const filteredModules =
    permissionsData?.modules
      .map((module) => ({
        ...module,
        resources: module.resources
          .map((resource) => ({
            ...resource,
            permissions: resource.permissions.filter((permission) =>
              normalizedFilter
                ? `${permission.key} ${permission.label}`
                    .toLowerCase()
                    .includes(normalizedFilter)
                : true
            ),
          }))
          .filter((resource) => resource.permissions.length > 0),
      }))
      .filter((module) => module.resources.length > 0) ?? [];

  return (
    <>
      <FormModal
        title={isEdit ? "Edit Role" : "Create New Role"}
        open={isOpen}
        onOpenChange={handleClose}
      >
        {isEdit && isRolePending ? (
          <div className="w-full flex items-center justify-center py-10">
            <Spinner size={70} />
          </div>
        ) : (
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
                <button
                  type="button"
                  onClick={() => methods.setValue("permissions", [])}
                  className="py-2 px-3 border border-grays-borders rounded-[12px]"
                >
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
              <div className="bg-primary-bg rounded-ml flex flex-col gap-4 p-2 max-h-[45vh] overflow-y-auto overscroll-contain">
                {isPermissionsPending ? (
                  <Text scale={"content"} className="text-neutrals-500 p-2">
                    Loading permissions...
                  </Text>
                ) : filteredModules.length === 0 ? (
                  <Text scale={"content"} className="text-neutrals-500 p-2">
                    No permissions found
                  </Text>
                ) : (
                  filteredModules.map((module) => (
                    <div key={module.key} className="flex flex-col gap-3">
                      <Text
                        scale={"content"}
                        weight={"accent"}
                        className="text-neutrals-700"
                      >
                        {module.label}
                      </Text>
                      {module.resources.map((resource) => (
                        <div key={resource.key} className="flex flex-col gap-2">
                          <Text
                            scale={"caption"}
                            className="text-neutrals-500"
                          >
                            {resource.label}
                          </Text>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {resource.permissions.map((permission) => (
                              <CompactCheckbox
                                key={permission.key}
                                label={permission.label}
                                name="permissions"
                                id={permission.key}
                                value={permission.key}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
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
                {isEdit ? "Save changes" : "Create role"}
              </Button>
            </div>
          </form>
          </FormProvider>
        )}
      </FormModal>
    </>
  );
};

export default AddRole;
