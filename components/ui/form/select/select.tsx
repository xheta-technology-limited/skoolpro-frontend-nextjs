"use client";
import { useFormContext, Controller } from "react-hook-form";
import { XIcon } from "@phosphor-icons/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ArrowSquareDown } from "iconsax-reactjs";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "@/components/animations";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  name: string;
  label?: string;
  options: SelectOption[];
  searchable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  isSuccess?: boolean;
  isLoading?: boolean;
  isWarning?: boolean;
  icon?: React.ReactNode;
};

const Select = ({
  name,
  label,
  options,
  searchable = false,
  placeholder,
  disabled,
  isLoading,
  icon,
}: SelectProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
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
        const selectedOption = options.find((o) => o.value === field.value);

        const filteredOptions = useMemo(() => {
          if (!searchable || !searchTerm) return options;
          return options.filter((o) =>
            o.label.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }, [searchTerm]);

        const isFloating =
          isOpen ||
          Boolean(selectedOption) ||
          (searchable && searchTerm.length > 0);

        const openList = () => {
          if (disabled) return;
          setIsOpen(true);
          setHighlightIndex(0);
          if (searchable) {
            setSearchTerm("");
            requestAnimationFrame(() => inputRef.current?.select());
          }
        };

        const selectOption = (option: SelectOption) => {
          field.onChange(option.value);
          setSearchTerm("");
          setIsOpen(false);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (disabled) return;

          if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
            e.preventDefault();
            openList();
            return;
          }

          if (!isOpen) return;

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((prev) =>
              Math.min(prev + 1, filteredOptions.length - 1)
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((prev) => Math.max(prev - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            const option = filteredOptions[highlightIndex];
            if (option) selectOption(option);
          } else if (e.key === "Escape") {
            e.preventDefault();
            setSearchTerm("");
            setIsOpen(false);
          }
        };

        return (
          <div className="relative" ref={containerRef}>
            {searchable ? (
              <input
                id="floating_select"
                ref={inputRef}
                value={isOpen ? searchTerm : selectedOption?.label ?? ""}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setHighlightIndex(0);
                  if (!isOpen) setIsOpen(true);
                }}
                onFocus={openList}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder=" "
                className={clsx(
                  icon && "pr-13.75",
                  "pr-13.75",
                  "w-75 h-[3.18rem] mb-2 peer rounded-ml bg-[#F5F5FF] px-ml text-[0.875rem] md:text-[1rem] focus:bg-transparent focus:border-primary-500 not-placeholder-shown:bg-transparent disabled:bg-[#F6F3FDCC] disabled:cursor-not-allowed cursor-pointer"
                )}
              />
            ) : (
              <button
                type="button"
                disabled={disabled}
                onClick={() => (isOpen ? setIsOpen(false) : openList())}
                onKeyDown={handleKeyDown}
                className={clsx(
                  "pr-13.75",
                  "w-75 h-[3.18rem] mb-2 peer rounded-ml bg-[#F5F5FF] px-ml text-left text-[0.875rem] md:text-[1rem] focus:bg-transparent focus:border-primary-500 disabled:bg-[#F6F3FDCC] disabled:cursor-not-allowed cursor-pointer",
                  selectedOption && "bg-transparent"
                )}
              >
                {selectedOption?.label}
              </button>
            )}

            <label
              htmlFor="floating_select"
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

            {!selectedOption && !isFloating && placeholder && (
              <span className="absolute left-ml top-4 text-[0.875rem] md:text-[1rem] text-neutral-300 pointer-events-none">
                {placeholder}
              </span>
            )}

            {icon && (
              <div className="absolute right-13.75 top-[0.843rem]">{icon}</div>
            )}

            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => (isOpen ? setIsOpen(false) : openList())}
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
              <ul className="absolute z-10 mt-1 w-75 max-h-60 overflow-auto rounded-ml bg-white shadow-lg py-1">
                {filteredOptions.length === 0 && (
                  <li className="px-ml py-2 text-[0.875rem] text-neutrals-1000">
                    No options found
                  </li>
                )}
                {filteredOptions.map((option, index) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectOption(option)}
                      onMouseEnter={() => setHighlightIndex(index)}
                      className={clsx(
                        "w-full text-neutrals-1000 text-left px-ml py-2 text-[0.875rem] md:text-[1rem] cursor-pointer",
                        index === highlightIndex && "bg-[#F5F5FF]",
                        option.value === field.value && "font-medium"
                      )}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {error && (
              <>
                <XIcon size={16} color="#C03744" />{" "}
                <span className="ml-2 text-xs text-[#C03744]">{error}</span>
              </>
            )}

            {isLoading && (
              <div className="flex gap-1">
                <Spinner />
              </div>
            )}
          </div>
        );
      }}
    />
  );
};

export default Select;
