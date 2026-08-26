"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, DocumentUpload } from "iconsax-reactjs";

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

import {
  SCHOOL_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
} from "@/app/onboarding/_components/SchoolProfileStep";

interface SchoolLicenseFile {
  name: string;
  sizeLabel: string;
  url: string;
}

interface Contact {
  id: string;
  type: string;
  label: string;
  value: string;
  is_primary: boolean;
}

interface Campus {
  id: string;
  name: string;
  is_primary: boolean;
  city: string;
  country_code: string;
  opening_status: string;
}

function getOptionLabel(
  options: { label: string; value: string }[],
  value: string | undefined
): string {
  return options.find((option) => option.value === value)?.label ?? value ?? "";
}

function getPrimaryContact(contacts: Contact[], types: string[]): string {
  const normalizedTypes = types.map((type) => type.toLowerCase());

  const primary = contacts.find(
    (contact) =>
      normalizedTypes.includes(contact.type.toLowerCase()) && contact.is_primary
  );

  if (primary) {
    return primary.value;
  }

  return (
    contacts.find((contact) =>
      normalizedTypes.includes(contact.type.toLowerCase())
    )?.value ?? ""
  );
}

function getContactByLabel(contacts: Contact[], labels: string[]): string {
  const normalizedLabels = labels.map((label) => label.toLowerCase());

  return (
    contacts.find((contact) =>
      normalizedLabels.includes(contact.label.toLowerCase())
    )?.value ?? ""
  );
}

function getSchoolTypes(
  types: { slug: string; is_active: boolean }[]
): string[] {
  return types.filter((type) => type.is_active).map((type) => type.slug);
}

function getAddress(campuses: Campus[]): string {
  const campus = campuses.find((campus) => campus.is_primary) ?? campuses[0];

  if (!campus) {
    return "";
  }

  return [campus.city, campus.country_code].filter(Boolean).join(", ");
}

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "S"
  );
}

function toDateOnly(value: string | undefined): string {
  if (!value) {
    return "";
  }

  return value.split("T")[0];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SchoolRecordPage() {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [licenseFiles, setLicenseFiles] = useState<SchoolLicenseFile[]>([]);

  const profile = useUserStore((state) => state.data.data);
  const updateData = useUserStore((state) => state.updateData);

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

    const contacts = profile.contacts ?? [];

    return {
      schoolName: profile.registered_name ?? "",
      displayName: profile.display_name ?? "",
      registrationNumber: profile.registration_numbers?.[0]?.number ?? "",
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

      website: getPrimaryContact(contacts, ["website", "web"]),

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

  const { handleSubmit, reset } = methods;

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
      const fileToRemove = previous.find((file) => file.name === name);

      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      return previous.filter((file) => file.name !== name);
    });
  }

  function handleLicenseUpload(event: React.ChangeEvent<HTMLInputElement>) {
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
      const existingNames = new Set(previous.map((file) => file.name));

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

  const onSubmit = (values: SchoolRecordFormValues) => {
    if (!profile) {
      return;
    }

    // --- Contacts: update the primary existing entry per category, or
    // append a new contact if none exists yet, so submitted values are
    // never silently discarded. ---
    const existingContacts = profile.contacts ?? [];

    const contactCategories: {
      matches: (contact: Contact) => boolean;
      value: string;
      fallback: { type: string; label: string };
    }[] = [
      {
        matches: (contact) => contact.type.toLowerCase() === "email",
        value: values.email,
        fallback: { type: "email", label: "Email" },
      },
      {
        matches: (contact) =>
          ["phone", "telephone", "mobile"].includes(contact.type.toLowerCase()),
        value: values.phoneNumber,
        fallback: { type: "phone", label: "Phone" },
      },
      {
        matches: (contact) => contact.label.toLowerCase().includes("emergency"),
        value: values.emergencyPhoneNumber,
        fallback: { type: "phone", label: "Emergency phone number" },
      },
      {
        matches: (contact) =>
          ["website", "web"].includes(contact.type.toLowerCase()),
        value: values.website,
        fallback: { type: "website", label: "Website" },
      },
      {
        matches: (contact) =>
          ["social_media", "social-media", "social"].includes(
            contact.type.toLowerCase()
          ),
        value: values.socialMediaHandle,
        fallback: { type: "social_media", label: "Social media" },
      },
    ];

    let updatedContacts: Contact[] = [...existingContacts];
    const newContacts: Contact[] = [];

    for (const category of contactCategories) {
      const primaryIndex = updatedContacts.findIndex(
        (contact) => category.matches(contact) && contact.is_primary
      );

      const matchIndex =
        primaryIndex !== -1
          ? primaryIndex
          : updatedContacts.findIndex((contact) => category.matches(contact));

      if (matchIndex !== -1) {
        updatedContacts[matchIndex] = {
          ...updatedContacts[matchIndex],
          value: category.value,
        };
      } else if (category.value) {
        newContacts.push({
          id: "",
          type: category.fallback.type,
          label: category.fallback.label,
          value: category.value,
          is_primary: true,
        });
      }
    }

    updatedContacts = [...updatedContacts, ...newContacts];

    // --- Campuses: persist the editable address back onto the primary
    // campus, preserving all other campus fields and entries. ---
    const existingCampuses = profile.campuses ?? [];
    const primaryCampusIndex = existingCampuses.findIndex(
      (campus) => campus.is_primary
    );
    const targetCampusIndex =
      primaryCampusIndex !== -1 ? primaryCampusIndex : 0;

    const [addressCity, addressCountryCode] = values.address
      .split(",")
      .map((part) => part.trim());

    const updatedCampuses: Campus[] =
      existingCampuses.length > 0
        ? existingCampuses.map((campus, index) =>
            index === targetCampusIndex
              ? {
                  ...campus,
                  city: addressCity ?? campus.city,
                  country_code: addressCountryCode ?? campus.country_code,
                }
              : campus
          )
        : [
            {
              id: "",
              name: "",
              is_primary: true,
              city: addressCity ?? "",
              country_code: addressCountryCode ?? "",
              opening_status: "",
            },
          ];

    const updatedRegistrationNumbers = (profile.registration_numbers ?? []).map(
      (registration, index) =>
        index === 0
          ? {
              ...registration,
              number: values.registrationNumber,
            }
          : registration
    );

    const selectedSlugs = values.schoolTypes;

    const updatedTypes = (profile.types ?? []).map((type) => ({
      ...type,
      is_active: selectedSlugs.includes(type.slug),
    }));

    const updatedProfile = {
      ...profile,
      registered_name: values.schoolName,
      display_name: values.displayName,
      ownership_type: values.ownershipType,
      founding_date: values.dateOfEstablishment,
      description: values.description,
      motto: values.motto,
      contacts: updatedContacts,
      registration_numbers: updatedRegistrationNumbers,
      types: updatedTypes,
      campuses: updatedCampuses,
    };

    updateData({
      data: updatedProfile,
    });

    setMode("view");
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
        .map((type) => getOptionLabel(SCHOOL_TYPE_OPTIONS, type))
        .join(", "),
    },
    {
      label: "Ownership type",
      value: getOptionLabel(OWNERSHIP_TYPE_OPTIONS, formValues.ownershipType),
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

  for (let index = 0; index < schoolDetailFields.length; index += 2) {
    rows.push([schoolDetailFields[index], schoolDetailFields[index + 1]]);
  }

  const schoolName =
    profile?.display_name || profile?.registered_name || "School";

  const email = getPrimaryContact(profile?.contacts ?? [], ["email"]);

  const address = getAddress(profile?.campuses ?? []);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      {mode === "view" && (
        <>
          <span className="text-[16px] font-normal leading-6 text-[#645D72] [font-family:var(--font-inter)]">
            SCHOOL DETAILS
          </span>

          <div className="flex min-h-41 w-full flex-col items-start justify-between gap-4 rounded-2xl border border-primary-100 bg-primary-bg px-4 py-6 sm:flex-row sm:items-center sm:px-12 sm:py-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-25 w-25 shrink-0">
                <AvatarFallback className="bg-neutrals-100">
                  {getInitials(schoolName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-semibold leading-[1.2] text-primary">
                  {schoolName}
                </span>

                <span className="text-[14px] font-normal leading-[1.2] text-neutrals-700">
                  {email}
                </span>

                <span className="text-[14px] font-normal leading-[1.2] text-neutrals-700">
                  {address}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={enterEditMode}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[28px] border border-primary bg-base-white px-8 py-4 sm:w-32.25"
            >
              <Edit size={24} variant="Bulk" color="#010081" />

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
            <div key={index} className="flex gap-2">
              <DetailField label={left.label} value={left.value} />

              {right && <DetailField label={right.label} value={right.value} />}
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
              <Input name="schoolName" label="School name" />

              <Input name="displayName" label="Display name" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input name="registrationNumber" label="Registration number" />

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
              <Input name="email" label="Email address" />

              <Input name="address" label="School address" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input name="phoneNumber" label="Phone number" />

              <Input
                name="emergencyPhoneNumber"
                label="Emergency phone number"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input name="website" label="School website" />

              <Input name="socialMediaHandle" label="Social media handle" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input name="motto" label="School motto" />

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
                  onRemove={() => removeLicenseFile(file.name)}
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
                  <span className="font-semibold text-primary">Browse</span> to
                  upload school letterhead
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex h-12 w-32 items-center justify-center rounded-[28px] bg-primary px-8 py-3"
              >
                <span className="text-[16px] font-normal leading-[1.2] text-white">
                  Save
                </span>
              </button>
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
