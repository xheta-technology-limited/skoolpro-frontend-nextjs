"use client";

import { useProgressRouter } from "@/features/page-loader";
import { ArrowLeft } from "iconsax-reactjs";
import { Text } from "@/components/ui";

interface Props {
  label: string;
  url: string;
  variant?: "sm" | "md";
}
export default function BackButton({ label, url, variant = "md" }: Props) {
  const router = useProgressRouter();
  return (
    <button
      onClick={() => router.replace(url)}
      className="flex gap-3 cursor-pointer items-center"
    >
      <ArrowLeft variant="Bulk" size={24} />
      <Text
        weight={"accent"}
        scale={variant === "md" ? "feature" : "highlight"}
        className="text-neutrals-900"
      >
        {label}
      </Text>
    </button>
  );
}
