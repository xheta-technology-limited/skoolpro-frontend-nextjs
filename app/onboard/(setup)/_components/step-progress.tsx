"use client";
import { CheckCircleIcon } from "@phosphor-icons/react";

export interface Step {
  /** Label shown under the step indicator */
  label: string;
}

export interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  onStepChange?: (index: number) => void;

  className?: string;
}

export default function StepProgress({
  steps,
  currentStep,
  onStepChange,
  className = "",
}: StepProgressProps) {
  return (
    <ol
      role="list"
      aria-label="Progress"
      className={`flex w-full max-w-182 items-start mx-auto ${className}`}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isLast = index === steps.length - 1;
        const isClickable = isCompleted && !!onStepChange;
        const lineActive = index < currentStep;

        return (
          <li
            key={step.label + index}
            className="relative flex flex-1 flex-col items-center"
          >
            {/* Connector lines */}
            {index !== 0 && (
              <div
                className={`absolute top-3 left-0 right-1/2 h-0.5 ${
                  index <= currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
            {!isLast && (
              <div
                className={`absolute top-3 left-1/2 right-0 h-0.5 ${
                  lineActive ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}

            {/* Indicator */}
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepChange?.(index)}
              aria-current={isActive ? "step" : undefined}
              className={`relative z-10 box-border flex h-6 w-6 shrink-0 items-center bg-white justify-center rounded-full border-8 transition-colors ${
                isClickable ? "cursor-pointer" : "cursor-default"
              } ${
                isActive
                  ? "border-primary shadow-[0px_0px_0px_4px_#F4EBFF]"
                  : isCompleted
                  ? "border-primary"
                  : "border-gray-200"
              }`}
            >
              {isActive ? (
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              ) : null}
            </button>

            {/* Label */}
            <span
              className={`mt-2 text-center md:text-nowrap text-sm ${
                isActive
                  ? "font-medium text-primary"
                  : isCompleted
                  ? "text-gray-500"
                  : "text-gray-900"
              }`}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
