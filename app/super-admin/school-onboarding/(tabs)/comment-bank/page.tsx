import { Suspense } from "react";
import Header from "../../_components/header";
import Body from "./_components/body";
import ActionButtons from "./_components/header-buttons";

export default function Comment() {
  return (
    <>
      <Header label="Comment bank">
        <ActionButtons />
      </Header>

      <Suspense fallback={null}>
        <Body />
      </Suspense>
    </>
  );
}
