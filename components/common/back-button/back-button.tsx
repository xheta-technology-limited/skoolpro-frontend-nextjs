"use client";

import { useProgressRouter } from "@/features/page-loader";
import { ArrowLeft } from "iconsax-reactjs";
import { Text } from "@/components/ui";

interface Props {
  label: string;
  url: string;
}
export default function BackButton({ label, url }: Props) {
  const router = useProgressRouter();
  return (
    <button
      onClick={() => router.replace(url)}
      className="flex gap-3 cursor-pointer items-center mb-6"
    >
      <ArrowLeft variant="Bulk" size={24} />
      <Text weight={"accent"} scale={"feature"} className="text-neutrals-900">
        {label}
      </Text>
    </button>
  );
}
