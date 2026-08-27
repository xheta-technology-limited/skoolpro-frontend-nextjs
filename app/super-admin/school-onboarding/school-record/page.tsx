"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, DocumentUpload } from "iconsax-reactjs";

import { toast } from "sonner";
import { Button } from "@/components/ui/custom-button";

import {
  Input,
  Select,
  DatePicker,
  TextArea,
  Checkbox,
} from "@/components/ui/form";

import DetailField from "@/app/onboarding/_components/DetailField";
import LicenseFileRow from "./_components/LicenseFileRow";

import {
  schoolRecordSchema,
  type SchoolRecordFormValues,
} from "@/app/super-admin/school-onboarding/school-record/schema/school-record-schema";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useUserStore } from "@/features/school-profile/school-profile.store";

import { useGetSchoolProfile } from "@/features/school-profile/api/get-school-profile";

import { schoolProfileKeys } from "@/features/school-profile/api/query-keys";

import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";

import {
  SCHOOL_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
} from "@/app/onboarding/_components/SchoolProfileStep";

import type {
  Campus,
  SchoolLicenseFile,
  UpdateCampusPayload,
  UpdateRegistrationNumberPayload,
  UpdateSchoolProfilePayload,
  Contact,
} from "./types";

import {
  formatFileSize,
  getAddress,
  getContactByLabel,
  getInitials,
  getOptionLabel,
  getPrimaryContact,
  getSchoolTypes,
  toDateOnly,
} from "./utils";

export default function SchoolRecordPage() {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [licenseFiles, setLicenseFiles] = useState<
    SchoolLicenseFile[]
  >([]);

  const profile = useUserStore((state) => state.data);
  const updateData = useUserStore((state) => state.updateData);

  const queryClient = useQueryClient();

  const { data: schoolProfile } = useGetSchoolProfile();

  useEffect(() => {
    if (schoolProfile) {
      updateData(schoolProfile);
    }
  }, [schoolProfile, updateData]);

  const updateSchoolMutation = useMutation<
    typeof profile,
    ServerErrorResponse,
    {
      schoolId: string;
      data: UpdateSchoolProfilePayload;
    }
  >({
    mutationFn: ({ schoolId, data }) =>
      api.put(`schools/${schoolId}`, data),
  });

  const updateCampusMutation = useMutation<
    Campus,
    ServerErrorResponse,
    {
      schoolId: string;
      campusId: string;
      data: UpdateCampusPayload;
    }
  >({
    mutationFn: ({ schoolId, campusId, data }) =>
      api.put(
        `schools/${schoolId}/campuses/${campusId}`,
        data
      ),
  });

  /*
   * PUT /schools/{school}/registration-numbers/{registration}
   */
  const updateRegistrationMutation = useMutation<
    unknown,
    ServerErrorResponse,
    {
      schoolId: string;
      registrationId: string;
      data: UpdateRegistrationNumberPayload;
    }
  >({
    mutationFn: ({ schoolId, registrationId, data }) =>
      api.put(
        `schools/${schoolId}/registration-numbers/${registrationId}`,
        data
      ),
  });

  const formValues = useMemo<SchoolRecordFormValues>(() => {
    if (!profile) {
      return {
        schoolName: "",
        displayName: "",
        registrationNumber: "",
        schoolTypes: [],
        ownershipType: "",
        dateOfEstablishment: "",
        email: "",
        address: "",
        phoneNumber: "",
        emergencyPhoneNumber: "",
        website: "",
        socialMediaHandle: "",
        motto: "",
        description: "",
      };
    }

    const contacts: Contact[] = profile.contacts ?? [];

    return {
      schoolName: profile.registered_name ?? "",

      displayName: profile.display_name ?? "",

      registrationNumber:
        profile.registration_numbers?.[0]?.number ?? "",

      schoolTypes: getSchoolTypes(profile.types ?? []),

      ownershipType: profile.ownership_type ?? "",

      dateOfEstablishment: toDateOnly(profile.founding_date),

      email: getPrimaryContact(contacts, ["email"]),

      address: getAddress(profile.campuses ?? []),

      phoneNumber: getPrimaryContact(contacts, [
        "phone",
        "telephone",
        "mobile",
      ]),

      emergencyPhoneNumber: getContactByLabel(contacts, [
        "emergency",
        "emergency phone",
        "emergency phone number",
      ]),

      website: getPrimaryContact(contacts, [
        "website",
        "web",
      ]),

      socialMediaHandle: getPrimaryContact(contacts, [
        "social_media",
        "social-media",
        "social",
      ]),

      motto: profile.motto ?? "",

      description: profile.description ?? "",
    };
  }, [profile]);

  const methods = useForm<SchoolRecordFormValues>({
    resolver: zodResolver(schoolRecordSchema),
    defaultValues: formValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(formValues);
  }, [formValues, reset]);

  const licenseFilesRef = useRef<SchoolLicenseFile[]>([]);

  useEffect(() => {
    licenseFilesRef.current = licenseFiles;
  }, [licenseFiles]);

  useEffect(() => {
    return () => {
      licenseFilesRef.current.forEach((file) => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, []);

  function enterEditMode() {
    reset(formValues);
    setMode("edit");
  }

  function removeLicenseFile(name: string) {
    setLicenseFiles((previous) => {
      const fileToRemove = previous.find(
        (file) => file.name === name
      );

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      return previous.filter((file) => file.name !== name);
    });
  }

  function handleLicenseUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const newFiles: SchoolLicenseFile[] = files.map((file) => ({
      name: file.name,
      sizeLabel: formatFileSize(file.size),
      url: URL.createObjectURL(file),
    }));

    setLicenseFiles((previous) => {
      const existingNames = new Set(
        previous.map((file) => file.name)
      );

      const filesToAdd: SchoolLicenseFile[] = [];

      for (const file of newFiles) {
        if (existingNames.has(file.name)) {
          URL.revokeObjectURL(file.url);
          continue;
        }

        existingNames.add(file.name);
        filesToAdd.push(file);
      }

      return [...previous, ...filesToAdd];
    });

    event.target.value = "";
  }

  const onSubmit = async (
    values: SchoolRecordFormValues
  ) => {
    if (!profile?.id) {
      return;
    }

    const failures: string[] = [];
    let anySucceeded = false;

    try {
      await updateSchoolMutation.mutateAsync({
        schoolId: profile.id,

        data: {
          registered_name: values.schoolName,
          display_name: values.displayName,
          ownership_type: values.ownershipType,
          founding_date: values.dateOfEstablishment,
          description: values.description,
          motto: values.motto,
          type_slugs: values.schoolTypes,
        },
      });
      anySucceeded = true;
    } catch (error) {
      console.error("Failed to update school details:", error);
      failures.push("School details");
    }

    const primaryCampus =
      profile.campuses?.find((campus) => campus.is_primary) ??
      profile.campuses?.[0];

    if (primaryCampus) {
      try {
        await updateCampusMutation.mutateAsync({
          schoolId: profile.id,
          campusId: primaryCampus.id,
          data: {
            name: primaryCampus.name,
            address_line_1: values.address,
            country_code: primaryCampus.country_code,
          },
        });
        anySucceeded = true;
      } catch (error) {
        console.error("Failed to update campus address:", error);
        failures.push("School address");
      }
    }

    const registrationNumber = profile.registration_numbers?.[0];

    if (registrationNumber) {
      try {
        await updateRegistrationMutation.mutateAsync({
          schoolId: profile.id,

          registrationId: registrationNumber.id,

          data: {
            country_code: registrationNumber.country_code,
            number: values.registrationNumber,
          },
        });
        anySucceeded = true;
      } catch (error) {
        console.error("Failed to update registration number:", error);
        failures.push("Registration number");
      }
    }

    if (anySucceeded) {
      await queryClient.invalidateQueries({
        queryKey: schoolProfileKeys.all,
      });
    }

    if (failures.length === 0) {
      toast.success("School record updated successfully.");
      setMode("view");
      return;
    }

    if (anySucceeded) {
      toast.warning(
        `Some details were saved, but ${failures.join(", ")} failed to update. Please try again.`
      );
      // Stay in edit mode so the person can retry the failed section(s)
      // without losing anything, and doesn't see the form silently
      // "succeed" when part of the save actually failed.
      return;
    }

    toast.error("Failed to update school record. Please try again.");
  };

  const schoolDetailFields: {
    label: string;
    value: string;
  }[] = [
    {
      label: "School name",
      value: formValues.schoolName,
    },
    {
      label: "Display name",
      value: formValues.displayName,
    },
    {
      label: "Registration number",
      value: formValues.registrationNumber,
    },
    {
      label: "School type",
      value: formValues.schoolTypes
        .map((type) =>
          getOptionLabel(SCHOOL_TYPE_OPTIONS, type)
        )
        .join(", "),
    },
    {
      label: "Ownership type",
      value: getOptionLabel(
        OWNERSHIP_TYPE_OPTIONS,
        formValues.ownershipType
      ),
    },
    {
      label: "Date of establishment",
      value: formValues.dateOfEstablishment,
    },
    {
      label: "Email address",
      value: formValues.email,
    },
    {
      label: "School address",
      value: formValues.address,
    },
    {
      label: "Phone number",
      value: formValues.phoneNumber,
    },
    {
      label: "Emergency phone number",
      value: formValues.emergencyPhoneNumber,
    },
    {
      label: "School website",
      value: formValues.website,
    },
    {
      label: "Social media handle",
      value: formValues.socialMediaHandle,
    },
    {
      label: "School motto",
      value: formValues.motto,
    },
    {
      label: "Description",
      value: formValues.description,
    },
  ];

  const rows: [
    (typeof schoolDetailFields)[0],
    (typeof schoolDetailFields)[0] | undefined
  ][] = [];

  for (
    let index = 0;
    index < schoolDetailFields.length;
    index += 2
  ) {
    rows.push([
      schoolDetailFields[index],
      schoolDetailFields[index + 1],
    ]);
  }

  const schoolName =
    profile?.display_name ||
    profile?.registered_name ||
    "School";

  const email = getPrimaryContact(
    profile?.contacts ?? [],
    ["email"]
  );

  const address = getAddress(profile?.campuses ?? []);

  const isSaving =
    isSubmitting ||
    updateSchoolMutation.isPending ||
    updateCampusMutation.isPending ||
    updateRegistrationMutation.isPending;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      {mode === "view" && (
        <>
          <span className="text-[16px] font-normal leading-6 text-[#645D72] [font-family:var(--font-inter)]">
            SCHOOL DETAILS
          </span>

          <div className="flex min-h-41 w-full flex-col items-start justify-between gap-4 rounded-2xl border border-primary-100 bg-primary-bg px-4 py-6 sm:flex-row sm:items-center sm:px-12 sm:py-8">
            <div className="flex w-full min-w-0 items-center gap-4">
              <Avatar className="h-25 w-25 shrink-0">
                <AvatarFallback className="bg-neutrals-100">
                  {getInitials(schoolName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-[16px] font-semibold leading-[1.2] text-primary">
                  {schoolName}
                </span>

                <span className="truncate text-[14px] font-normal leading-[1.2] text-neutrals-700">
                  {email}
                </span>

                <span className="truncate text-[14px] font-normal leading-[1.2] text-neutrals-700">
                  {address}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={enterEditMode}
              className="flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[28px] border border-primary bg-base-white px-8 py-4 sm:w-32.25"
            >
              <Edit
                size={24}
                variant="Bulk"
                color="#010081"
              />

              <span className="text-[18px] font-normal leading-[1.2] text-primary">
                Edit
              </span>
            </button>
          </div>
        </>
      )}

      <span className="text-[16px] font-normal leading-6 text-[#645D72] [font-family:var(--font-inter)]">
        SCHOOL DETAILS
      </span>

      {mode === "view" ? (
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-primary-bg p-2">
          {rows.map(([left, right], index) => (
            <div key={index} className="flex w-full min-w-0 gap-2">
              <DetailField
                label={left.label}
                value={left.value}
              />

              {right && (
                <DetailField
                  label={right.label}
                  value={right.value}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                name="schoolName"
                label="School name"
              />

              <Input
                name="displayName"
                label="Display name"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                name="registrationNumber"
                label="Registration number"
              />

              <div className="[&>div>button:first-child]:bg-primary-bg!">
                <Checkbox
                  name="schoolTypes"
                  label="Select school type"
                  options={SCHOOL_TYPE_OPTIONS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Select
                name="ownershipType"
                label="Ownership type"
                options={OWNERSHIP_TYPE_OPTIONS}
              />

              <DatePicker
                name="dateOfEstablishment"
                label="Date of establishment"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                name="email"
                label="Email address"
                disabled
              />

              <Input
                name="address"
                label="School address"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                name="phoneNumber"
                label="Phone number"
                disabled
              />

              <Input
                name="emergencyPhoneNumber"
                label="Emergency phone number"
                disabled
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                name="website"
                label="School website"
                disabled
              />

              <Input
                name="socialMediaHandle"
                label="Social media handle"
                disabled
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                name="motto"
                label="School motto"
              />

              <TextArea
                name="description"
                label="Description"
                maxLength={300}
              />
            </div>

            <span className="text-[16px] font-normal leading-6 text-[#645D72] [font-family:var(--font-inter)]">
              SCHOOL LICENSE
            </span>

            <div className="flex flex-wrap gap-4">
              {licenseFiles.map((file) => (
                <LicenseFileRow
                  key={file.name}
                  name={file.name}
                  sizeLabel={file.sizeLabel}
                  url={file.url}
                  mode="edit"
                  onRemove={() =>
                    removeLicenseFile(file.name)
                  }
                />
              ))}

              <label className="flex h-17.5 w-full max-w-82.25 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-[#713EDD] bg-[#F9F6FF] p-4 text-center sm:w-82.25 focus-within:outline focus-within:outline-primary">
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.png,.jpg,.jpeg"
                  multiple
                  onChange={handleLicenseUpload}
                />

                <DocumentUpload
                  size={20}
                  variant="Bulk"
                  className="text-primary-700"
                />

                <span className="font-lora text-[11px] font-normal leading-[1.2] text-neutrals-700 sm:whitespace-nowrap">
                  Drag and drop or{" "}
                  <span className="font-semibold text-primary">
                    Browse
                  </span>{" "}
                  to upload school letterhead
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <Button type="submit" loading={isSaving} className="w-32">
                {isSaving ? "Saving" : "Save"}
              </Button>
            </div>
          </form>
        </FormProvider>
      )}

      {mode === "view" && (
        <>
          <span className="text-[16px] font-normal leading-6 text-[#645D72] [font-family:var(--font-inter)]">
            SCHOOL LICENSE
          </span>

          <div className="flex flex-wrap gap-4">
            {licenseFiles.map((file) => (
              <LicenseFileRow
                key={file.name}
                name={file.name}
                sizeLabel={file.sizeLabel}
                url={file.url}
                mode="view"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}