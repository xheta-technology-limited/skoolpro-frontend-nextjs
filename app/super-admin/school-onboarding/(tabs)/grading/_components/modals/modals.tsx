"use client";
import { usePathname, useSearchParams } from "next/navigation";
import AddGradeScaleModal from "./add-grade-scale";
import AddGradeSheme from "./add-grading-scheme";
import AddPassMark from "./add-pass-mark";
import AddPromotionRule from "./add-promotion-rule";

export default function Modals() {
  const params = usePathname();
  const searchParams = useSearchParams();

  const isOnGrading = params.includes("/grading");

  return (
    <>
      {isOnGrading && searchParams.get("add-grade-scale") === "true" && (
        <AddGradeScaleModal />
      )}
      {isOnGrading && searchParams.get("add-grade-scheme") === "true" && (
        <AddGradeSheme />
      )}

      {isOnGrading && searchParams.get("add-promotion-rule") === "true" && (
        <AddPromotionRule />
      )}
    </>
  );
}
