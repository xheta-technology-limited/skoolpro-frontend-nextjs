import { Suspense } from "react";
import FirstModal from "./modals/add-staff-first";
import SecondModal from "./modals/add-staff-second";

export default function AddStaff() {
  return (
    <>
      <Suspense fallback={null}>
        <FirstModal />
        <SecondModal />
      </Suspense>
    </>
  );
}
