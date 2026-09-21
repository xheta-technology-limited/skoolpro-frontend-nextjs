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
import { useCreateStaff } from "@/features/user-management/staff-management/api/create-staff";
import { useProgressRouter } from "@/features/page-loader";
import { setFormErrors } from "@/lib/helpers/set-form-errors";
import { toast } from "sonner";

export default function AddStaff() {
  const secondFormMethods = useForm<AddStaffSecondFormData>({
    defaultValues: {},
    resolver: zodResolver(addStaffSecondSchema),
  });

  const firstFormMethods = useForm<AddStaffFirstFormData>({
    defaultValues: {},
    resolver: zodResolver(addStaffFirstSchema),
  });

  const router = useProgressRouter();

  const { mutate, isPending } = useCreateStaff();
  const onSubmit = () => {
    mutate(
      { ...firstFormMethods.getValues(), ...secondFormMethods.getValues() },
      {
        onSuccess: () => {
          toast.success("New staff added successfully");
          router.push(
            "/super-admin/user-management/staff-management?add-modal=true&current=success"
          );
        },
        onError: (res) => {
          setFormErrors(secondFormMethods.setError, res.errors);
          setFormErrors(firstFormMethods.setError, res.errors);
        },
      }
    );
  };
  return (
    <>
      <Suspense fallback={null}>
        <FirstModal methods={firstFormMethods} />
        <SecondModal
          methods={secondFormMethods}
          onSubmit={onSubmit}
          isPending={isPending}
        />{" "}
        {/**This should probably take in first modal's form thingies then combine and send to the api on submit */}
      </Suspense>
    </>
  );
}
