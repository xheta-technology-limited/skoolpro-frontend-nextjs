"use client";
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
} & React.InputHTMLAttributes<HTMLTextAreaElement>;

const TextArea = ({
  name,
  label,
  isSuccess,
  isLoading,
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
        {...props}
        className={clsx(
          "w-75 h-30 mb-2 py-4 peer rounded-s bg-[#F5F5FF] px-ml text-[0.875rem] md:text-[1rem] focus:bg-transparent focus:border-primary-500 not-placeholder-shown:bg-transparent disabled:bg-[#F6F3FDCC]"
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
      {props.maxLength && (
        <p className="text-neutrals-400 text-[12px] text-right">
          {value.length}/{props.maxLength}
        </p>
      )}

      {isLoading && (
        <div className="flex gap-1">
          <DotLottieReact
            src="/animations/ios-style-loading-spinner.lottie"
            loop
            autoplay
            className="w-4 h-4"
          />
          <span className="text-xs text-neutrals-400">Loading</span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
