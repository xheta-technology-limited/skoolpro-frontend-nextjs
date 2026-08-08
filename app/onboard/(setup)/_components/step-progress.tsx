"use client";
export interface Step {
  /** Label shown under the step indicator */
  label: string;
}

export interface StepProgressProps {
  /** Ordered list of steps to render */
  steps: Step[];
  /** Zero-based index of the active step (controlled) */
  currentStep: number;
  /** Called with the new index when a completed/clickable step is selected */
  onStepChange?: (index: number) => void;
  /** Allow clicking back to previously completed steps */
  allowNavigateToCompleted?: boolean;
  className?: string;
}

export default function StepProgress({
  steps,
  currentStep,
  onStepChange,
  allowNavigateToCompleted = false,
  className = "",
}: StepProgressProps) {
  return (
    <ol
      role="list"
      aria-label="Progress"
      className={`flex w-full items-start ${className}`}
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isLast = index === steps.length - 1;
        const isClickable =
          allowNavigateToCompleted && isCompleted && !!onStepChange;

        return (
          <li
            key={step.label + index}
            className={`flex items-center ${isLast ? "flex-none" : "flex-1"}`}
          >
            <div className="flex flex-col items-start">
              {/* Indicator */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepChange?.(index)}
                aria-current={isActive ? "step" : undefined}
                className={`relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                } ${isActive ? "bg-primary/10" : ""}`}
              >
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors ${
                    isActive || isCompleted ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
              </button>

              {/* Label */}
              <span
                className={`mt-2 whitespace-nowrap text-sm ${
                  isActive
                    ? "font-medium text-primary"
                    : isCompleted
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={`mx-2 mt-3 h-px flex-1 transition-colors ${
                  isCompleted ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
