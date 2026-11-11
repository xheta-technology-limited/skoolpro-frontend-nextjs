import { Suspense } from "react";
import Header from "../../_components/header";
import Body from "./_components/body";
import ActionButtons from "./_components/header-buttons";
import AddDepartment from "./_components/modals/add-department";
import EditDepartment from "./_components/modals/edit-department";
import DepartmentDetailModal from "./_components/modals/show-department";
import ProvisionDefaultsModal from "./_components/modals/provision-defaults";

export default function Departments() {
  return (
    <>
      <Header label="Departments">
        <Suspense fallback={null}>
          <ActionButtons />
        </Suspense>
      </Header>

      <Suspense fallback={null}>
        <Body />
        <AddDepartment />
        <EditDepartment />
        <DepartmentDetailModal />
        <ProvisionDefaultsModal />
      </Suspense>
    </>
  );
}
