"use client";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import { XIcon } from "@phosphor-icons/react";
import { DocumentUpload } from "iconsax-reactjs";
import clsx from "clsx";
import Text from "../../text/text";

type Props = {
  name: string;
  label?: string;
  /** Accepted file types (MIME types / extensions). Defaults to all files. */
  accept?: DropzoneOptions["accept"];
  /** Whether multiple files may be selected. Defaults to false (single file). */
  multiple?: boolean;
  /** Maximum size per file in bytes. */
  maxSize?: number;
  /** Maximum number of files when `multiple` is true. */
  maxFiles?: number;
  /** Disables the dropzone. */
  disabled?: boolean;
  /** Fired when a dropped file is rejected (wrong type, too large, etc.). */
  onDropRejected?: DropzoneOptions["onDropRejected"];
};

export default function DragNDrop({
  name,
  label,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled,
  onDropRejected,
}: Props) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <Controller
      name={name}
      render={({ field }) => {
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          accept,
          multiple,
          maxSize,
          maxFiles,
          disabled,
          onDropRejected,
          onDrop: (acceptedFiles) => {
            field.onChange(multiple ? acceptedFiles : acceptedFiles[0]);
          },
        });
        const file = field.value as File | undefined;
        return (
          <div className="relative max-w-full">
            <div
              {...getRootProps()}
              className={clsx(
                "mb-2 flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-ml border border-dashed border-[#713EDD] bg-[#F9F6FF] p-4 text-center",
                isDragActive && "bg-primary-500/10",
                error && "bg-[#FBD6D45C]"
              )}
            >
              <input {...getInputProps()} className="absolute" />
              <DocumentUpload
                variant="Bulk"
                size={28}
                className="text-primary-700"
              />
              <Text
                scale={"highlight"}
                weight={"standard"}
                className="text-neutrals-700 mb-4"
              >
                Drag and drop or <span className="text-primary">Browse</span> to
                upload {label}
              </Text>
            </div>

            {file && (
              <div className="mb-2 max-w-full flex items-center justify-between gap-2 rounded-ml border border-neutrals-200 bg-primary-bg px-ml py-2">
                <span className="min-w-0 truncate text-[0.875rem]">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => field.onChange(undefined)}
                  className="cursor-pointer text-neutrals-400"
                >
                  <XIcon size={16} />
                </button>
              </div>
            )}

            {error && (
              <div className="flex">
                <XIcon size={16} color="#C03744" />{" "}
                <span className="ml-2 text-xs text-error-200">{error}</span>
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
