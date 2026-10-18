"use client";
import { Text } from "@/components/ui";
import { PAGES } from "./constants";
import PageCard from "./_components/page-card";

export default function SchoolOnboarding() {
  return (
    <>
      <Text weight="accent" scale="feature" className="text-neutrals-900">
        School onboarding
      </Text>

      <div className="h-17.25" />

      <div className="flex gap-6 flex-wrap">
        {PAGES.map((page) => (
          <PageCard
            key={page.label}
            page={page}
            className="md:min-w-50 lg:min-w-81 flex-1"
          />
        ))}
      </div>
    </>
  );
}
