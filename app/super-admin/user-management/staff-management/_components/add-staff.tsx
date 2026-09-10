import { Suspense } from "react";
import FirstModal from "./modals/add-staff-first";
import SecondModal from "./modals/add-staff-second";
import ThirdModal from "./modals/import-user-third";
import FourthModal from "./modals/import-user-fourth";

export default function AddStaff() {
  return (
    <>
      <Suspense fallback={null}>
        <FirstModal />
        <SecondModal />
        <ThirdModal />
        <FourthModal />
      </Suspense>
    </>
  );
}
