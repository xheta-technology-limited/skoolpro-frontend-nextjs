"use client";

interface StepperProps {
  currentStep: "school-profile" | "choose-plan" | "review";
}

const steps = [
  { key: "school-profile", label: "School profile" },
  { key: "choose-plan", label: "Choose plan" },
  { key: "review", label: "Review" },
] as const;

const Stepper = ({ currentStep }: StepperProps) => {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="mx-auto flex w-full max-w-95 items-start sm:max-w-125 lg:max-w-2xl">
        {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;
            const isDone = isCompleted || isActive;
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;

            const leftLineColor = isDone ? "bg-primary" : "bg-neutrals-200";
            const rightLineColor = isCompleted ? "bg-primary" : "bg-neutrals-200";

            return (
            <div key={step.key} className="contents">
                {/* circle (with in-frame line segments) + label */}
                <div className="flex w-25 shrink-0 flex-col items-center gap-2 sm:w-32.5 sm:gap-3 lg:w-38">
                <div className="flex w-full items-center">
                    <div className={`h-px flex-1 ${isFirst ? "invisible" : leftLineColor}`} />
                    <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6 ${
                        isDone ? "bg-primary" : "bg-neutrals-200"
                    }`}
                    >
                    <div className="h-1.5 w-1.5 rounded-full bg-white sm:h-2 sm:w-2" />
                    </div>
                    <div className={`h-px flex-1 ${isLast ? "invisible" : rightLineColor}`} />
                </div>

                <span
                    className={`text-center text-xs whitespace-nowrap sm:text-sm ${
                    isDone ? "font-semibold text-primary" : "text-neutrals-500"
                    }`}
                >
                    {step.label}
                </span>
                </div>

                {/* connecting line between frames */}
                {index < steps.length - 1 && (
                <div
                    className={`mt-2.5 h-px flex-1 sm:mt-3 ${
                    isCompleted ? "bg-primary" : "bg-neutrals-200"
                    }`}
                />
                )}
            </div>
            );
        })}
    </div>
  );
};

export default Stepper;