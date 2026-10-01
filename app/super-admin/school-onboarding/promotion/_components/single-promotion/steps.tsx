import { Text } from "@/components/ui";
import clsx from "clsx";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { number } from "zod";

const texts = ["Prepared", "Review & Adjust", "Commit"];
interface SProps {
  stage: number;
}
export default function CurrentStage({ stage }: SProps) {
  return (
    <div className="flex items-center gap-4">
      {texts.map((text, index) => (
        <Stage
          key={index}
          index={index}
          label={text}
          step={index + 1}
          status={
            stage === 0
              ? "pending"
              : stage > index
              ? "completed"
              : stage === index
              ? "current"
              : "pending"
          }
        />
      ))}
    </div>
  );
}

interface Props {
  step: number;
  status: "current" | "completed" | "pending";
  label: string;
  index: number;
}
function Stage({ status, step, index, label }: Props) {
  return (
    <div className="gap-2 items-center flex">
      {status === "completed" ? (
        <DotLottieReact
          src="/animations/success-check.lottie"
          className="w-9 h-9"
          loop
          autoplay
          segment={[85, 130]}
        />
      ) : (
        <Text
          className={clsx(
            status === "current" && "text-success-300 bg-[#EDFDFA]",
            status === "pending" && "text-neutrals-700 bg-[#F4F6F5]",
            "p-2 rounded-ml"
          )}
          scale={"content"}
          weight={"standard"}
        >
          {step}
        </Text>
      )}
      <Text scale={"content"} className="text-neutrals-700">
        {label}
      </Text>
    </div>
  );
}
