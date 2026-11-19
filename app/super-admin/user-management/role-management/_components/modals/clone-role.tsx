"use client";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { usePathname, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import {
  CloneRoleModalFormData,
  cloneRoleFormSchema,
} from "@/features/role-management/schemas/clone-role-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useListRoles } from "@/features/role-management/api/list-roles";
import { useCloneRole } from "@/features/role-management/api/clone-role";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import { toast } from "sonner";
import { Text } from "@/components/ui";
import { InfoIcon } from "@phosphor-icons/react";
import { InfoCircle } from "iconsax-reactjs";
import { useEffect } from "react";

const CloneRole = () => {
  const router = useProgressRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("clone-role") === "true";
  const roleId = searchParams.get("role-id");

  const methods = useForm<CloneRoleModalFormData>({
    resolver: zodResolver(cloneRoleFormSchema),
    defaultValues: { role_id: "", name: "" },
  });

  const { data: rolesData, isPending: isRolesPending } = useListRoles(
    undefined,
    {
      enabled: isOpen,
      refetchOnWindowFocus: false,
    }
  );
  const { mutate: cloneRole, isPending: isClonePending } = useCloneRole();

  const roleOptions = (rolesData?.data ?? []).map((role) => ({
    value: String(role.id),
    label: titleCase(role.label),
  }));

  const handleClose = () => {
    methods.reset();
    router.replace(path);
  };

  const onSubmit = (data: CloneRoleModalFormData) => {
    cloneRole(
      { id: data.role_id, data: { name: data.name } },
      {
        onSuccess: () => {
          toast.success("Role cloned");
          handleClose();
        },
      }
    );
  };

  useEffect(() => {
    if (rolesData && roleId) {
      methods.setValue("role_id", roleId);
    }
  }, [rolesData, roleId]);

  return (
    <FormModal title="Clone Role" open={isOpen} onOpenChange={handleClose}>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Select
            name="role_id"
            label="Select role"
            options={roleOptions}
            searchable
            isLoading={isRolesPending}
            isLoadingText="Loading roles"
          />
          <Input name="name" label="Enter role name" />
          <div className="bg-primary-bg rounded-ml p-2">
            <div className="gap-2 flex items-center borde rounded-[8px] border-grays-borders bg-white p-3">
              <InfoCircle
                size={40}
                style={{ color: "var(--color-neutrals-800)" }}
                variant="Bulk"
              />
              <Text scale={"captionMobile"} className="text-neutrals-700">
                Cloning copies the source role’s permissions (and its role-level
                restrictions). It works even from a protected system role; the
                copy is a normal custom role, always active.
              </Text>
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
              loading={isClonePending}
              type="submit"
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            >
              Clone role
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
};

export default CloneRole;
