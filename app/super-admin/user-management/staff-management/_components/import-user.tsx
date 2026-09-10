import { Suspense } from "react";
import FirstModal from "./modals/import-user-first";
import SecondModal from "./modals/import-user-second";
import ThirdModal from "./modals/import-user-third";

export default function ImportStaff() {
  return (
    <Suspense fallback={null}>
      <FirstModal />
      <SecondModal />
      <ThirdModal />
    </Suspense>
  );
}
