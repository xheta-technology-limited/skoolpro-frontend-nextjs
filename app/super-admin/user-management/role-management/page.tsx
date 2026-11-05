import Header from "./_components/header/header";
import Body from "./_components/body";
import { Suspense } from "react";

export default function RoleManagement() {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <Suspense>
        <Body />
      </Suspense>
    </div>
  );
}
