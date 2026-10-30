import { Text } from "@/components/ui";
import TabSwitcher from "./_components/tab-switcher";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Text weight="accent" scale="feature" className="text-neutrals-900">
        Structure & Curriculum
      </Text>

      <div className="h-6" />

      <div className="p-6 rounded-ml flex flex-col w-full bg-white">
        <TabSwitcher />
        <div className="h-8" />

        {children}
      </div>
    </>
  );
}
