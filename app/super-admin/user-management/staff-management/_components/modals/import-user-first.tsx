"use client";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { DragNDrop } from "@/components/ui/form";
import FormModal from "@/components/ui/form-modal";
import { useProgressRouter } from "@/features/page-loader";
import { useGetTemplate } from "@/features/user-management/api/get-user-template";
import { useStartImport } from "@/features/user-management/api/start-import";
import {
  StartImportFormData,
  startImportSchema,
} from "@/features/user-management/schemas/start-import";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentDownload } from "iconsax-reactjs";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function FirstModal() {
  const searchParams = useSearchParams();
  const router = useProgressRouter();

  const { isFetching: isTemplateFetching, refetch: downloadTemplate } =
    useGetTemplate("staff", {
      enabled: false,
      refetchOnWindowFocus: false,
    });

  const { mutate, isPending: isMutatePending } = useStartImport();

  const handleDownload = async () => {
    const { data: template } = await downloadTemplate();
    if (!template) return;

    const url = URL.createObjectURL(template);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Staff.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const open = searchParams.get("import-modal");
  const current = searchParams.get("current");
  const isOpen = open === "true" && current === "1";

  const methods = useForm<StartImportFormData>({
    defaultValues: {},
    resolver: zodResolver(startImportSchema),
  });

  const handleClose = () =>
    router.replace("/super-admin/user-management/staff-management");

  const handleProceed = (data: StartImportFormData) => {
    const payload = { ...data, module: "staff", entity_type: "staff" };
    mutate(payload, {
      onSuccess: (res) =>
        router.push(
          `/super-admin/user-management/staff-management?import-modal=true&current=2&job-id=${res.id}`
        ),
    });
  };

  return (
    <FormModal
      title={"Import Staff"}
      onOpenChange={handleClose}
      open={isOpen}
      step={{ current: 1, total: 4 }}
    >
      <>
        <div>
          <Text scale={"content"} className="text-neutrals-900">
            Download the template, then upload your file
          </Text>
          <Text scale={"caption"} className="text-neutrals-700">
            The template has a column for every staff field, with the required
            ones marked. Fill it in your spreadsheet app and save as CSV.
          </Text>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-primary-bg border border-primary-100 rounded-ml p-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 h-fit">
              <Text scale={"content"} className="text-neutrals-700">
                Staff import template
              </Text>
              <Text scale={"caption"} className="text-neutrals-700">
                CSV · 15 columns · required: staff number, first name, last
                name, category
              </Text>
            </div>

            <Button
              variant="secondary"
              leftIcon={<DocumentDownload size={16} className="text-primary" />}
              className="h-max"
              onClick={handleDownload}
              loading={isTemplateFetching}
            >
              Download template
            </Button>
          </div>
          <FormProvider {...methods}>
            <form
              id="import-form"
              onSubmit={methods.handleSubmit(handleProceed)}
            >
              <DragNDrop
                name="file"
                label="CSV"
                accept={{ "text/csv": [".csv"] }}
                onDropRejected={() =>
                  alert("MAKE THIS SET THE FORM STATE ERRORS FOR THIS FIELD")
                }
              />
            </form>
          </FormProvider>

          <div className="flex gap-6 items-center *:flex-1">
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
              form="import-form"
              size="lg"
              className="w-full mt-auto sm:mt-0 sm:w-fit self-end"
            >
              Proceed
            </Button>
          </div>
        </div>
      </>
    </FormModal>
  );
}
