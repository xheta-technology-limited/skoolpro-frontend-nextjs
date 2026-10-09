import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";

import { Button } from "@/components/ui/custom-button";
import { Input, Select } from "@/components/ui/form";
import { GENDER_SELECT_OPTIONS } from "@/config/constants";
import { setFormErrors } from "@/lib/helpers";
import {
  editGuardianSchema,
  type EditGuardianFormData,
} from "@/features/user-management/guardian-management/schemas/edit-guardian-schema";
import { useUpdateGuardian } from "@/features/user-management/guardian-management/api/update-guardian";
import type { GuardianDetail } from "@/features/user-management/guardian-management/types/guardian-detail-types";
import { PREFERRED_CONTACT_METHOD_OPTIONS } from "@/features/user-management/guardian-management/schemas/guardian-schema";
import CountrySelectField from "@/app/onboarding/_components/fields/CountrySelectField";

interface Props {
  onCancel: () => void;
  onSaved: () => void;
  guardian: GuardianDetail;
}

const toDefaults = (guardian: GuardianDetail): EditGuardianFormData => ({
  title: guardian.title ?? "",
  first_name: guardian.first_name ?? "",
  middle_name: guardian.middle_name ?? "",
  last_name: guardian.last_name ?? "",
  gender: guardian.gender ?? "",
  nationality: guardian.nationality ?? "",
  occupation: guardian.occupation ?? "",
  employer: guardian.employer ?? "",
  phone: guardian.phone ?? "",
  alt_phone: guardian.alt_phone ?? "",
  email: guardian.email ?? "",
  preferred_contact_method: guardian.preferred_contact_method ?? "",
  home_address: guardian.home_address ?? "",
  work_address: guardian.work_address ?? "",
});

export default function EditMode({ onCancel, onSaved, guardian }: Props) {
  const methods = useForm<EditGuardianFormData>({
    defaultValues: toDefaults(guardian),
    resolver: zodResolver(editGuardianSchema),
  });

  const { mutate, isPending } = useUpdateGuardian();

  const onSubmit = (data: EditGuardianFormData) => {
    mutate(
      { guardianId: guardian.id, payload: data },
      {
        onSuccess: () => {
          toast.success("Guardian updated successfully");
          onSaved();
        },
        onError: (res) => {
          if (res?.errors) {
            setFormErrors(methods.setError, res.errors);
          } else if (!(res instanceof ApiError)) {
            toast.error(res?.message || "Failed to update guardian.");
          }
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        id="edit-guardian-form"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <span className="font-poppins uppercase text-base font-normal leading-[120%] tracking-normal text-neutrals-700">
            Parent details
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              form="edit-guardian-form"
              loading={isPending}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative aspect-square w-full max-w-71 shrink-0 overflow-hidden rounded-[32px] border-4 border-primary bg-[#D9D9D9] sm:w-71">
            {guardian.photo_path ? (
              <Image
                src={guardian.photo_path}
                alt={guardian.full_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[13px] text-neutrals-500">
                No photo
              </div>
            )}
          </div>

          <div className="flex-1 rounded-ml bg-white p-2 grid grid-cols-2 content-start gap-4">
            <Input name="title" label="Enter title" />
            <Input name="first_name" label="Enter first name" />
            <Input name="middle_name" label="Enter middle name" />
            <Input name="last_name" label="Enter last name" />
            <Select
              name="gender"
              label="Select gender"
              options={GENDER_SELECT_OPTIONS}
            />
            {/*
              Unlike the student form (where nationality is a plain
              Input and only country_of_birth uses CountrySelectField),
              a guardian has only "nationality" — no separate
              country_of_birth — so it's the one using the real
              country picker here. This also resolves the earlier
              unconfirmed/empty NATIONALITY_OPTIONS list from the
              original Add Guardian modal build.
            */}
            <CountrySelectField
              name="nationality"
              placeholder="Enter nationality"
            />
            <Input name="occupation" label="Enter occupation" />
            <Input name="employer" label="Enter employer" />
          </div>
        </div>

        <div className="rounded-ml bg-white p-2 grid grid-cols-2 content-start gap-4">
          <Input name="phone" label="Enter phone number" />
          <Input name="alt_phone" label="Enter alt. phone number" />
          <Input name="email" label="Enter email address" />
          <Select
            name="preferred_contact_method"
            label="Select preferred contact method"
            options={PREFERRED_CONTACT_METHOD_OPTIONS}
          />
          <Input name="home_address" label="Enter home address" />
          <Input name="work_address" label="Enter work address" />
        </div>
      </form>
    </FormProvider>
  );
}