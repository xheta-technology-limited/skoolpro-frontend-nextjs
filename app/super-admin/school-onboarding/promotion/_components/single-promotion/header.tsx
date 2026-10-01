"use client";

import { useProgressRouter } from "@/features/page-loader";
import { ArrowLeft } from "iconsax-reactjs";
import { Text } from "@/components/ui";

export default function Header() {
  const router = useProgressRouter();
  return (
    <button
      onClick={() => router.replace("/super-admin/school-onboarding/promotion")}
      className="flex gap-3 cursor-pointer items-center"
    >
      <ArrowLeft variant="Bulk" size={24} />
      <Text weight={"accent"} scale={"feature"} className="text-neutrals-900">
        Promotion Runs
      </Text>
    </button>
  );
}
