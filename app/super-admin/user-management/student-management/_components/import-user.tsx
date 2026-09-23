import { Suspense } from "react";
import FirstModal from "./import-user-first";
import SecondModal from "./import-user-second";
import ThirdModal from "./import-user-third";
import FourthModal from "./import-user-fourth";

export default function ImportStudent() {
  return (
    <Suspense fallback={null}>
      <FirstModal />
      <SecondModal />
      <ThirdModal />
      <FourthModal />
    </Suspense>
  );
}
