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

interface Props {
  defaults?: CreateRoleFormData & { subject_id?: string };
}
const AddRole = ({ defaults }: Props) => {
  const router = useProgressRouter();
  const methods = useForm<CreateRoleFormData>({
    defaultValues: defaults ? defaults : {},
    resolver: zodResolver(createRoleSchema),
  });
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("add-role") === "true";
  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");

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
            <div className="flex flex-col">
              <Input name="name" label="Enter role name" />
              <Text
                scale={"content"}
                weight={"accent"}
                as="p"
                className="text-neutrals-700"
              >
                Assign permissions
              </Text>
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
