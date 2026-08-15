"use client";
import { useFormContext, Controller } from "react-hook-form";
import { XIcon } from "@phosphor-icons/react";
import { ArrowSquareDown, TickSquare } from "iconsax-reactjs";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export type CheckboxOption = {
  label: string;
  value: string;
};

type CheckboxProps = {
  name: string;
  label?: string;
  options: CheckboxOption[];
  max?: number;
  disabled?: boolean;
};

const Checkbox = ({ name, label, options, max, disabled }: CheckboxProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value: string[] = field.value ?? [];
        const selectedOptions = options.filter((o) => value.includes(o.value));
        const isFloating = isOpen || selectedOptions.length > 0;

        const toggleOption = (option: CheckboxOption) => {
          if (disabled) return;
          const isSelected = value.includes(option.value);
          if (isSelected) {
            field.onChange(value.filter((v) => v !== option.value));
            return;
          }
          if (max !== undefined && value.length >= max) return;
          field.onChange([...value, option.value]);
        };

        const isMaxedOut = max !== undefined && value.length >= max;

        return (
          <div className="relative" ref={containerRef}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
              className={clsx(
                "pr-13.75",
                "w-full min-h-[3.18rem] mb-2 rounded-ml bg-[#F5F5FF] px-ml py-3 text-left text-[0.875rem] md:text-[1rem] disabled:bg-[#F6F3FDCC] disabled:cursor-not-allowed cursor-pointer",
                selectedOptions.length > 0 && "bg-transparent",
                error && "bg-[#FBD6D45C]"
              )}
            >
              <span
                className={clsx(selectedOptions.length === 0 && "opacity-0")}
              >
                {selectedOptions.length > 0
                  ? selectedOptions.map((o) => o.label).join(", ")
                  : " "}
              </span>
            </button>

            <label
              className={clsx(
                "absolute text-neutral-400 transition-all pointer-events-none",
                isFloating
                  ? "top-0 text-[0.75rem]"
                  : "top-4 text-[0.875rem] md:text-[1rem]",
                "left-ml",
                disabled && "text-neutrals-100"
              )}
            >
              {label}
            </label>

            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
              className="absolute right-5 top-[0.843rem] disabled:text-neutrals-100"
            >
              <ArrowSquareDown
                size={24}
                variant="Bulk"
                className={clsx(
                  "text-neutrals-400 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            {isOpen && (
              <ul className="absolute flex flex-col gap-4 z-10 mt-1 w-full max-h-60 overflow-auto rounded-ml bg-[#F5F5FF] shadow-lg p-2">
                {options.map((option) => {
                  const isSelected = value.includes(option.value);
                  const isOptionDisabled =
                    disabled || (!isSelected && isMaxedOut);
                  return (
                    <li
                      key={option.value}
                      className={clsx(
                        "rounded-[8px] border border-[#F0EBFB] py-2 px-4 bg-white"
                      )}
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => toggleOption(option)}
                        disabled={isOptionDisabled}
                        className={clsx(
                          "w-full text-neutrals-1000 text-left px-ml py-2 text-[0.875rem] md:text-[1rem] cursor-pointer flex items-center justify-between gap-2",
                          isOptionDisabled &&
                            "text-neutrals-200 cursor-not-allowed"
                        )}
                      >
                        <span>{option.label}</span>
                        <TickSquare
                          variant={isSelected ? "Bold" : "Linear"}
                          size={20}
                          className={clsx(
                            isSelected
                              ? "text-primary-500"
                              : "text-neutrals-300"
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {error && (
              <>
                <XIcon size={16} color="#C03744" />{" "}
                <span className="ml-2 text-xs text-error-200">{error}</span>
              </>
            )}
          </div>
        );
      }}
    />
  );
};

export default Checkbox;
