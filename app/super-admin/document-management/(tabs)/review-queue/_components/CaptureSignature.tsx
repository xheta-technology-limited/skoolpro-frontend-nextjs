"use client";

import { useEffect, useRef } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useWatch,
} from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { DocumentUpload, Edit, TickSquare } from "iconsax-reactjs";
import { toast } from "sonner";

import FormModal from "@/components/ui/form-modal";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/custom-button";
import { useCaptureSignature } from "@/features/documents/api/capture-signature";
import type { CaptureSignaturePayload } from "@/features/documents/types/document-types";
import { notifyError } from "../../../_components/document-ui";

interface CaptureSignatureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
}

const METHODS = [
  { value: "typed", label: "Typed" },
  { value: "drawn", label: "Drawn" },
  { value: "uploaded", label: "Uploaded" },
  { value: "click", label: "Click to sign" },
] as const;

type Method = (typeof METHODS)[number]["value"];

interface CaptureFormValues {
  method: Method;
  typed_signature: string;
  drawn_signature: string; // PNG data URL, "" until something is drawn
  signature_file: File | undefined;
  adopted: boolean;
  signer_name: string;
  signer_capacity: string;
}

const DEFAULT_VALUES: CaptureFormValues = {
  method: "typed",
  typed_signature: "",
  drawn_signature: "",
  signature_file: undefined,
  adopted: false,
  signer_name: "",
  signer_capacity: "",
};

// Sent as the `statement` for click-to-sign, and shown beside the tick.
const ADOPT_STATEMENT =
  "I, the named signer, adopt this document and confirm the statement is true.";

// The API's limit for signature images.
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const DASHED_BOX =
  "rounded-[16px] border border-dashed border-[#B8A9EE] bg-primary-bg";

// Freehand signature pad on a canvas. Reports a PNG data URL after each
// stroke, and "" when cleared.
function SignaturePad({
  value,
  onChange,
}: {
  value: string;
  onChange: (dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const moved = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // Size the canvas to its box (scaled for sharp lines on hi-dpi
  // screens) and set the pen once.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1A1A1A";
  }, []);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  function handleDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    moved.current = false;
    last.current = point(e);
  }

  function handleMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const next = point(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last.current = next;
    moved.current = true;
  }

  function handleUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    // A bare click draws nothing, so don't report it as a signature.
    if (moved.current) onChange(e.currentTarget.toDataURL("image/png"));
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    onChange("");
  }

  return (
    <div className={`relative h-32 ${DASHED_BOX}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        className="absolute inset-0 h-full w-full touch-none rounded-ml"
      />
      {!value && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-[14px] text-neutrals-900">
          <Edit size={18} variant="Bulk" color="#010081" />
          Signature Pad
        </div>
      )}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-2 text-[12px] text-primary"
        >
          Clear
        </button>
      )}
    </div>
  );
}

// Drag-and-drop for an uploaded signature image.
function SignatureDropzone({
  value,
  onChange,
}: {
  value: File | undefined;
  onChange: (file: File) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    onDrop: (accepted) => {
      if (accepted[0]) onChange(accepted[0]);
    },
    onDropRejected: () => toast.error("Upload a PNG or JPG image."),
  });

  return (
    <div
      {...getRootProps()}
      className={`flex h-32 cursor-pointer flex-col items-center justify-center gap-3 px-4 text-center ${DASHED_BOX} ${
        isDragActive ? "border-primary" : ""
      }`}
    >
      <input {...getInputProps()} />
      <DocumentUpload size={24} variant="Bulk" color="#7A6FE0" />
      {value ? (
        <span className="max-w-full truncate text-[14px] text-neutrals-900">
          {value.name}
        </span>
      ) : (
        <span className="text-[14px] text-neutrals-900">
          Drag and drop or{" "}
          <span className="font-medium text-primary">Browse</span> to upload
        </span>
      )}
    </div>
  );
}

export default function CaptureSignatureModal({
  open,
  onOpenChange,
  documentId,
}: CaptureSignatureModalProps) {
  const captureMutation = useCaptureSignature();
  const methods = useForm<CaptureFormValues>({ defaultValues: DEFAULT_VALUES });
  const { control, handleSubmit, reset, setValue, setError, clearErrors, formState } =
    methods;

  const method = useWatch({ control, name: "method" });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  function selectMethod(next: Method) {
    setValue("method", next);
    setValue("drawn_signature", "");
    clearErrors();
  }

  const onSubmit = async (values: CaptureFormValues) => {
    let invalid = false;

    if (values.method === "typed" && !values.typed_signature.trim()) {
      setError("typed_signature", { message: "Type your full name" });
      invalid = true;
    }
    if (values.method === "drawn" && !values.drawn_signature) {
      setError("drawn_signature", { message: "Draw your signature" });
      invalid = true;
    }
    if (values.method === "uploaded" && !values.signature_file) {
      setError("signature_file", { message: "Upload a signature image" });
      invalid = true;
    }
    if (values.method === "click" && !values.adopted) {
      setError("adopted", { message: "Tick the box to adopt this document" });
      invalid = true;
    }
    if (!values.signer_name.trim()) {
      setError("signer_name", { message: "Enter the signer's name" });
      invalid = true;
    }
    if (
      values.method === "uploaded" &&
      values.signature_file &&
      values.signature_file.size > MAX_IMAGE_BYTES
    ) {
      setError("signature_file", { message: "The image must be 2 MB or less" });
      invalid = true;
    }
    if (invalid) return;

    const signer_name = values.signer_name.trim();
    const signer_capacity = values.signer_capacity.trim() || undefined;

    try {
      let payload: CaptureSignaturePayload;
      if (values.method === "typed") {
        payload = {
          method: "typed",
          typed_signature: values.typed_signature.trim(),
          signer_name,
          signer_capacity,
        };
      } else if (values.method === "drawn") {
        // The pad reports a PNG data URL; the API wants an image file.
        const image = await (await fetch(values.drawn_signature)).blob();
        payload = { method: "drawn", image, signer_name, signer_capacity };
      } else if (values.method === "uploaded") {
        if (!values.signature_file) return;
        payload = {
          method: "uploaded",
          image: values.signature_file,
          signer_name,
          signer_capacity,
        };
      } else {
        payload = {
          method: "click_to_sign",
          statement: ADOPT_STATEMENT,
          signer_name,
          signer_capacity,
        };
      }

      await captureMutation.mutateAsync({ documentId, payload });
      toast.success("Signature captured");
      handleOpenChange(false);
    } catch (error) {
      notifyError(error, "Failed to capture the signature.");
    }
  };

  const errors = formState.errors;

  return (
    <FormModal
      open={open}
      onOpenChange={handleOpenChange}
      title="Capture Signature"
      maxWidth="max-w-144"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-medium text-neutrals-700">
              Method
            </span>
            <div role="tablist" className="flex flex-wrap items-center gap-2">
              {METHODS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={method === option.value}
                  onClick={() => selectMethod(option.value)}
                  className={`h-7 rounded-sm px-4 text-[12px] ${
                    method === option.value
                      ? "bg-primary font-medium text-white"
                      : "text-neutrals-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {method === "typed" && (
            <Input
              name="typed_signature"
              label="Type full name as signature"
            />
          )}

          {method === "drawn" && (
            <div className="flex flex-col gap-1">
              <Controller
                name="drawn_signature"
                control={control}
                render={({ field }) => (
                  <SignaturePad value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.drawn_signature && (
                <span className="text-[12px] text-error">
                  {errors.drawn_signature.message}
                </span>
              )}
            </div>
          )}

          {method === "uploaded" && (
            <div className="flex flex-col gap-1">
              <Controller
                name="signature_file"
                control={control}
                render={({ field }) => (
                  <SignatureDropzone
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.signature_file && (
                <span className="text-[12px] text-error">
                  {errors.signature_file.message}
                </span>
              )}
            </div>
          )}

          {method === "click" && (
            <div className="flex flex-col gap-1">
              <Controller
                name="adopted"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] text-neutrals-900 ${DASHED_BOX}`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                      {field.value ? (
                        <TickSquare size={24} variant="Bulk" color="#010081" />
                      ) : (
                        <span
                          className="h-5 w-5 rounded-sm border-2 border-neutrals-400"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    {ADOPT_STATEMENT}
                  </button>
                )}
              />
              {errors.adopted && (
                <span className="text-[12px] text-error">
                  {errors.adopted.message}
                </span>
              )}
            </div>
          )}

          <Input name="signer_name" label="Enter signer name" />
          <Input name="signer_capacity" label="Enter signer capacity" />

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="flex h-14 flex-1 items-center justify-center rounded-[28px] border border-primary bg-base-white px-8 py-4"
            >
              <span className="text-[16px] font-normal leading-[1.2] text-primary">
                Cancel
              </span>
            </button>

            <Button
              type="submit"
              loading={formState.isSubmitting || captureMutation.isPending}
              className="h-14 flex-1 rounded-[28px]"
            >
              Capture
            </Button>
          </div>
        </form>
      </FormProvider>
    </FormModal>
  );
}