"use client";
import { Text } from "@/components/ui";
import { useProgressRouter } from "@/features/page-loader";
import { usePathname } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";

export default function TabSwitcher() {
  const pathname = usePathname();
  const router = useProgressRouter();
  const isStructure =
    pathname === "/super-admin/structure-and-curriculum/structure"
      ? true
      : false;
  const isCurriculum =
    pathname === "/super-admin/structure-and-curriculum/curriculum"
      ? true
      : false;

  const activeStyles: CSSProperties = {
    backgroundColor: "rgba(1, 0, 103, 1)",
    color: "white",
    borderRadius: "24px",
  };
  const styles: CSSProperties = {
    backgroundColor: "transparent",
    color: "rgba(90, 85, 85, 1)",
  };
  return (
    <div className="p-2 flex gap-2 border-2 rounded-lg border-[rgba(240, 235, 251, 1)] *:flex-1">
      <button
        className="block"
        onClick={() =>
          router.push("/super-admin/structure-and-curriculum/structure")
        }
      >
        <Text
          style={isStructure ? activeStyles : styles}
          className="text-center w-full py-2"
          scale={"caption"}
        >
          Structure
        </Text>
      </button>

      <button
        className="block"
        onClick={() =>
          router.push("/super-admin/structure-and-curriculum/curriculum")
        }
      >
        <Text
          style={isCurriculum ? activeStyles : styles}
          className="text-center w-full py-2"
          scale={"caption"}
        >
          Curriculum
        </Text>
      </button>
    </div>
  );
}
