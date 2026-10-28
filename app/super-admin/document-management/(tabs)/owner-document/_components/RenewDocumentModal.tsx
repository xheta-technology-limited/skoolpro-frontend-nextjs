"use client";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { DocumentUpload } from "iconsax-reactjs";

import FormModal from "@/components/ui/form-modal";
import { Button } from "@/components/ui/custom-button";
import { DatePicker } from "@/components/ui/form";
import { useRenewDocument } from "@/features/documents/api/renew-document";
import { notifyError } from "../../../_components/document-ui";

const renewDocumentSchema = z.object({
  file: z.instanceof(File, { message: "Please upload a document." }),
  expiry_date: z.string().min(1, "Please select a new expiry date."),
});

type RenewDocumentFormData = z.infer<typeof renewDocumentSchema>;

interface RenewDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId?: string;
}

export default function RenewDocumentModal({
  open,
  onOpenChange,
  documentId,
}: RenewDocumentModalProps) {
  const methods = useForm<RenewDocumentFormData>({
    resolver: zodResolver(renewDocumentSchema),
  });

  const { handleSubmit, reset, control, formState } = methods;

  const renewMutation = useRenewDocument();

  const onSubmit = async (data: RenewDocumentFormData) => {
    if (!documentId) {
      toast.error("Document ID is missing.");
      return;
    }

    try {
      await renewMutation.mutateAsync({
        documentId,
        payload: {
          file: data.file,
          expiry_date: data.expiry_date.slice(0, 10),
        },
      });

      toast.success("Renewal submitted for review");
      reset();
      onOpenChange(false);
    } catch (error) {
      notifyError(error, "Failed to renew document.");
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={handleClose}
      title="Renew Document"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6 pt-4"
        >
          <Controller
            name="file"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col gap-1">
                <label className="flex min-h-30 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary bg-[#F9F6FF] text-center transition-colors hover:bg-primary-bg">
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(event) =>
                      field.onChange(
                        event.target.files?.[0] ?? undefined
                      )
                    }
                  />

                  <DocumentUpload
                    size={24}
                    variant="Bulk"
                    className="text-primary"
                  />

                  <span className="text-[14px] text-neutrals-700">
                    {field.value ? (
                      field.value.name
                    ) : (
                      <>
                        Drag and drop or{" "}
                        <span className="font-semibold text-primary">
                          Browse
                        </span>{" "}
                        to upload
                      </>
                    )}
                  </span>
                </label>

                {error && (
                  <span className="text-[12px] text-error-200">
                    {error.message}
                  </span>
                )}
              </div>
            )}
          />

          <div className="w-full">
            <DatePicker
              name="expiry_date"
              label="Enter new expiry date"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleClose(false)}
              className="h-12 flex-1 rounded-[28px] border border-primary text-[16px] text-primary"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={
                formState.isSubmitting || renewMutation.isPending
              }
              className="h-12 flex-1 rounded-[28px] text-[16px]"
            >
              Upload
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}
