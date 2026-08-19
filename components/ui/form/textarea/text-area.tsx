"use client";
import { Spinner } from "@/components/animations";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { useFormContext, useWatch } from "react-hook-form";

type TextAreaProps = {
  name: string;
  search?: boolean;
  label?: string;
  isSuccess?: boolean;
  isLoading?: boolean;
  maxLength?: number;
} & React.InputHTMLAttributes<HTMLTextAreaElement>;

const TextArea = ({
  name,
  label,
  isSuccess,
  isLoading,
  maxLength,
  ...props
}: TextAreaProps) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  const value = useWatch({
    control,
    name,
  });
  return (
    <div className="relative">
      <textarea
        id="floating_textarea"
        {...register(name)}
        maxLength={maxLength}
        {...props}
        className={clsx(
          "w-full h-30 mb-2 py-4 peer rounded-s bg-[#F5F5FF] px-ml text-[0.875rem] md:text-[1rem] focus:bg-transparent focus:outline-primary-500 focus:outline-1 disabled:bg-[#F6F3FDCC]",
          error && "bg-[#FBD6D45C]",
          props.className
        )}
        placeholder=" "
      />

      <label
        htmlFor="floating_textarea"
        className={clsx(
          "left-ml absolute peer-placeholder-shown:top-4 text-neutral-400 transition-all peer-focus:top-0 peer-focus:text-[0.75rem] peer-not-placeholder-shown:text-[0.75rem] peer-disabled:text-neutrals-100"
        )}
      >
        {label}
      </label>

      {error && (
        <>
          <XIcon size={16} color="#C03744" />{" "}
          <span className="ml-2 text-xs text-[#C03744]">{error}</span>
        </>
      )}
      {maxLength && (
        <p className="text-neutrals-400 text-[12px] text-right">
          {value?.length ?? 0}/{maxLength}
        </p>
      )}

      {isLoading && (
        <div className="flex gap-1">
          <Spinner size={16} color={"#9f9c9c"} />
          <span className="text-xs text-neutrals-400">Loading</span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
