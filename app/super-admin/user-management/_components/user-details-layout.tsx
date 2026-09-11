"use client";
import { ArrowLeft, DocumentDownload } from "iconsax-reactjs";
import { Text } from "@/components/ui";
import { Button } from "@/components/ui/custom-button";
import { useProgressRouter } from "@/features/page-loader";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

type Tab = {
  label: string;
  href: string;
};
interface Props {
  pageLabel: string;
  tabs: Tab[];
  //onDownloadDataClick: () => void;
  children: ReactNode;
  backUrl: string;
}

export default function UserDetailsLayout({
  pageLabel,
  //onDownloadDataClick,
  children,
  backUrl,
  tabs,
}: Props) {
  const router = useProgressRouter();
  const pathname = usePathname();
  return (
    <>
      <div className="flex justify-between items-center flex-wrap md:min-w-xl lg:min-w-2xl mb-6 gap-4">
        <button
          onClick={() => router.replace(backUrl)}
          className="flex gap-3 cursor-pointer items-center"
        >
          <ArrowLeft variant="Bulk" size={24} />
          <Text
            weight={"accent"}
            scale={"feature"}
            className="text-neutrals-900"
          >
            {pageLabel}
          </Text>
        </button>

        <div className="flex gap-4 items-center">
          <Button
            rightIcon={
              <DocumentDownload
                size={20}
                variant="Bulk"
                className="text-base-white"
              />
            }
            size="md"
            variant="primary"
            onClick={() => alert("Not implemented yet")}
          >
            Download data
          </Button>
        </div>
      </div>

      <div className="bg-white p-1 md:p-6 w-full">
        <div className="p-2 gap-2 hidden md:flex items-center border-2 border-grays-borders rounded-lg mb-8 *:flex-1">
          {tabs.map((tab) => {
            const isActive = pathname.includes(tab.label.toLocaleLowerCase());
            return (
              <Link
                key={tab.label}
                className={twMerge(
                  "px-6 py-2 text-[0.875rem] rounded-lg hover:bg-primary-200 text-center transition-all duration-200",
                  isActive && "bg-primary-900 text-white hover:bg-primary-900"
                )}
                href={tab.href}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div>{children}</div>
      </div>
    </>
  );
}
