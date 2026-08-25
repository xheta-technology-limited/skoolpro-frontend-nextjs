"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, DocumentUpload } from "iconsax-reactjs";
import { Input, Select, DatePicker, TextArea } from "@/components/ui/form";
import DetailField from "@/app/onboarding/_components/DetailField";
import LicenseFileRow from "./_components/LicenseFileRow";
import {
  schoolRecordSchema,
  type SchoolRecordFormValues,
} from "@/lib/utils/school-record-schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SchoolLicenseFile {
  name: string;
  sizeLabel: string;
  url: string;
}

const SCHOOL_TYPE_OPTIONS = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Primary, Secondary", value: "primary_secondary" },
];

const OWNERSHIP_TYPE_OPTIONS = [
  { label: "Private", value: "private" },
  { label: "Government", value: "government" },
  { label: "Trust", value: "trust" },
];

const schoolProfile = {
  name: "Tobi Salem College",
  email: "tosacollege@gmail.com",
  address: "Wuse 2, Abuja, Nigeria",
  avatarUrl: "/school-avatar-placeholder.png",
};

const initialValues: SchoolRecordFormValues = {
  schoolName: "Tobi Salem College",
  displayName: "TSC",
  registrationNumber: "TSC-03082026",
  schoolType: "primary_secondary",
  ownershipType: "private",
  dateOfEstablishment: "2021-11-11",
  email: "tosacollege@gmail.com",
  address: "15, Wuse 2. Abuja, Nigera",
  phoneNumber: "+234 818 358 1817",
  emergencyPhoneNumber: "+234 818 358 1817",
  website: "www.tscollege.com",
  socialMediaHandle: "tscollege/ig",
  motto: "Raising the pioneers",
  description:
    "We are a focused on structured learning to pivot each student...",
};

const initialLicenseFiles: SchoolLicenseFile[] = [
  { name: "Practise License.pdf", sizeLabel: "570 KB", url: "#" },
  { name: "Registration doc.pdf", sizeLabel: "570 KB", url: "#" },
];

function getOptionLabel(
  options: { label: string; value: string }[],
  value: string | undefined
): string {
  return options.find((o) => o.value === value)?.label ?? value ?? "";
}

export default function SchoolRecordPage() {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [savedValues, setSavedValues] =
    useState<SchoolRecordFormValues>(initialValues);
  const [licenseFiles, setLicenseFiles] =
    useState<SchoolLicenseFile[]>(initialLicenseFiles);

  const methods = useForm<SchoolRecordFormValues>({
    resolver: zodResolver(schoolRecordSchema),
    defaultValues: savedValues,
  });

  const { handleSubmit, reset } = methods;

  function enterEditMode() {
    reset(savedValues);
    setMode("edit");
  }

  function removeLicenseFile(name: string) {
    setLicenseFiles((prev) => prev.filter((f) => f.name !== name));
  }

  const onSubmit = (data: SchoolRecordFormValues) => {
    setSavedValues(data);
    setMode("view");
  };

  const schoolDetailFields: { label: string; value: string }[] = [
    { label: "School name", value: savedValues.schoolName },
    { label: "Display name", value: savedValues.displayName ?? "" },
    {
      label: "Registration number",
      value: savedValues.registrationNumber ?? "",
    },
    {
      label: "School type",
      value: getOptionLabel(SCHOOL_TYPE_OPTIONS, savedValues.schoolType),
    },
    {
      label: "Ownership type",
      value: getOptionLabel(OWNERSHIP_TYPE_OPTIONS, savedValues.ownershipType),
    },
    {
      label: "Date of establishment",
      value: savedValues.dateOfEstablishment ?? "",
    },
    { label: "Email address", value: savedValues.email },
    { label: "School address", value: savedValues.address ?? "" },
    { label: "Phone number", value: savedValues.phoneNumber },
    {
      label: "Emergency phone number",
      value: savedValues.emergencyPhoneNumber ?? "",
    },
    { label: "School website", value: savedValues.website ?? "" },
    {
      label: "Social media handle",
      value: savedValues.socialMediaHandle ?? "",
    },
    { label: "School motto", value: savedValues.motto ?? "" },
    { label: "Description", value: savedValues.description ?? "" },
  ];

  const rows: [
    (typeof schoolDetailFields)[0],
    (typeof schoolDetailFields)[0] | undefined
  ][] = [];
  for (let i = 0; i < schoolDetailFields.length; i += 2) {
    rows.push([schoolDetailFields[i], schoolDetailFields[i + 1]]);
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      {mode === "view" && (
        <>
          <span className="text-[16px] font-normal leading-6 text-[#645D72] [font-family:var(--font-inter)]">
            SCHOOL DETAILS
          </span>

          <div className="flex min-h-41 w-full flex-col items-start justify-between gap-4 rounded-2xl border border-primary-100 bg-[#F5F5FF] px-4 py-6 sm:flex-row sm:items-center sm:px-12 sm:py-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-25 w-25 shrink-0">
                <AvatarImage
                  src={schoolProfile.avatarUrl}
                  alt=""
                  className="object-cover"
                />
                <AvatarFallback className="bg-neutrals-100">S</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-semibold leading-[1.2] text-primary">
                  {schoolProfile.name}
                </span>
                <span className="text-[14px] font-normal leading-[1.2] text-neutrals-700">
                  {schoolProfile.email}
                </span>
                <span className="text-[14px] font-normal leading-[1.2] text-neutrals-700">
                  {schoolProfile.address}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={enterEditMode}
              className="flex h-8.25 w-24.5 items-center justify-center gap-2 rounded-[28px] border border-primary-100 bg-white px-6 py-2"
            >
              <Edit size={16} variant="Bulk" color="#010081" />
              <span className="text-[14px] font-normal leading-[1.2] text-primary">
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
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-[#F5F5FF] p-2">
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
              <Select
                name="schoolType"
                label="School type"
                options={SCHOOL_TYPE_OPTIONS}
              />
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

              <label className="flex h-17.5 w-full max-w-82.25 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed p-4 text-center bg-[#F9F6FF] border-[#713EDD] sm:w-82.25">
                <input type="file" className="hidden" />
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
