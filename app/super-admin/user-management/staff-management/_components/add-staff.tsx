"use client";
import { Suspense } from "react";
import FirstModal from "./modals/add-staff-first";
import SecondModal from "./modals/add-staff-second";
import {
  AddStaffFirstFormData,
  addStaffFirstSchema,
  AddStaffSecondFormData,
  addStaffSecondSchema,
} from "@/features/user-management/staff-management/schemas/add-staff-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function AddStaff() {
  const secondFormMethods = useForm<AddStaffSecondFormData>({
    defaultValues: {},
    resolver: zodResolver(addStaffSecondSchema),
  });

  const firstFormMethods = useForm<AddStaffFirstFormData>({
    defaultValues: {},
    resolver: zodResolver(addStaffFirstSchema),
  });
  return (
    <>
      <Suspense fallback={null}>
        <FirstModal methods={firstFormMethods} />
        <SecondModal methods={secondFormMethods} />{" "}
        {/**This should probably take in first modal's form thingies then combine and send to the api on submit */}
      </Suspense>
    </>
  );
}
