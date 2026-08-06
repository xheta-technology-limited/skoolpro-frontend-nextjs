"use client";
import { useDropzone } from "react-dropzone";
import { Controller, useFormContext } from "react-hook-form";
import { XIcon } from "@phosphor-icons/react";
import { DocumentUpload } from "iconsax-reactjs";
import clsx from "clsx";
import Text from "../../text/text";

type Props = {
  name: string;
  label?: string;
};

export default function DragNDrop({ name, label }: Props) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <Controller
      name={name}
      render={({ field }) => {
        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: (acceptedFiles) => {
            field.onChange(acceptedFiles[0]);
          },
        });
        const file = field.value as File | undefined;

        return (
          <div className="relative">
            <div
              {...getRootProps()}
              className={clsx(
                "mb-2 flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-ml border border-dashed border-[#713EDD] bg-[#F9F6FF] px-ml py-4 text-center",
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
                {label ?? "Drag 'n' drop a file here, or click to select"}
              </Text>
            </div>

            {file && (
              <div className="mb-2 flex items-center justify-between gap-2 rounded-ml border border-neutrals-200 bg-[#F5F5FF] px-ml py-2">
                <span className="truncate text-[0.875rem]">{file.name}</span>
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
