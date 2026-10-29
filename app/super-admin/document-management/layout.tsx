"use client";

import { Suspense } from "react";

import TabsNav from "../../../components/common/tabs/tabs-nav";
import UploadDocumentModal, {
  OpenModalButton,
} from "./_components/upload-document";
import { useUserStore } from "@/features/school-profile/school-profile.store";
import { useGetDocuments } from "@/features/documents/api/get-documents";
import { useGetReviewQueue } from "@/features/documents/api/get-review-queue";

export default function DocumentManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schoolId = useUserStore((state) => state.data?.id) ?? "";

  const { data: ownerDocuments } = useGetDocuments("school", schoolId, {
    page: 1,
    per_page: 1,
  });

  const { data: reviewQueue } = useGetReviewQueue({
    page: 1,
    per_page: 1,
  });

  const DOC_MANAGEMENT_TABS = [
    {
      label: "Owner Document",
      href: "/super-admin/document-management/owner-document",
      count: ownerDocuments?.meta.total ?? 0,
    },
    {
      label: "Review Queue",
      href: "/super-admin/document-management/review-queue",
      count: reviewQueue?.meta.total ?? 0,
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="flex w-full flex-col gap-4 sm:h-12 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-neutrals-900">
          Document Management
        </h1>

        <OpenModalButton />
      </div>

      <TabsNav tabs={DOC_MANAGEMENT_TABS} className="mt-6" />

      <div className="mb-8 w-full rounded-2xl border border-grays-borders bg-white">
        {children}
      </div>

      <Suspense fallback={null}>
        <UploadDocumentModal />
      </Suspense>
    </div>
  );
}