"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { AddSquare } from "iconsax-react";
import FormSectionCard from "./FormSectionCard";
import TextField from "./fields/TextField";
import SelectField from "./fields/SelectField";
import DateField from "./fields/DateField";
import TextareaField from "./fields/TextareaField";
import ToggleField from "./fields/ToggleField";
import ColorField from "./fields/ColorField";
import CountrySelectField from "./fields/CountrySelectField";

export interface SchoolProfileFormValues {
  schoolName: string;
  displayName: string;
  schoolType: string;
  ownershipType: string;
  educationAuthority: string;
  country: string;
  dateOfEstablishment: string;
  description: string;
  registrationNumber: string;
  regCountry: string;
  issuingAuthority: string;
  expiryDate: string;
  locationName: string;
  locationCode: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  landmark: string;
  timezone: string;
  studentCapacity: string;
  contactType: string;
  contactLabel: string;
  contactValue: string;
  keyContactRole: string;
  keyContactFullName: string;
  keyContactRoleTitle: string;
  keyContactEmail: string;
  keyContactPhone: string;
  primaryColor: string;
  primaryColorSwatch: string;
  secondaryColor: string;
  secondaryColorSwatch: string;
  tertiaryColor: string;
  tertiaryColorSwatch: string;
  accentColor: string;
  accentColorSwatch: string;
  priorityLevel: string;
  targetGoLive: string;
}

interface SchoolProfileStepProps {
  onContinue: (data: SchoolProfileFormValues) => void;
  defaultValues?: Partial<SchoolProfileFormValues>;
}

const SchoolProfileStep = ({ onContinue, defaultValues }: SchoolProfileStepProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<SchoolProfileFormValues>({
    defaultValues,
  });

  const schoolName = watch("schoolName", "");
  const displayName = watch("displayName", "");
  const schoolType = watch("schoolType", "");
  const ownershipType = watch("ownershipType", "");
  const educationAuthority = watch("educationAuthority", "");
  const country = watch("country", "");
  const description = watch("description", "");

  const registrationNumber = watch("registrationNumber", "");
  const regCountry = watch("regCountry", "");
  const issuingAuthority = watch("issuingAuthority", "");

  const locationName = watch("locationName", "");
  const locationCode = watch("locationCode", "");
  const addressLine1 = watch("addressLine1", "");
  const city = watch("city", "");
  const state = watch("state", "");
  const postalCode = watch("postalCode", "");
  const landmark = watch("landmark", "");
  const timezone = watch("timezone", "");
  const studentCapacity = watch("studentCapacity", "");

  const contactType = watch("contactType", "");
  const contactLabel = watch("contactLabel", "");
  const contactValue = watch("contactValue", "");

  const keyContactRole = watch("keyContactRole", "");
  const keyContactFullName = watch("keyContactFullName", "");
  const keyContactRoleTitle = watch("keyContactRoleTitle", "");
  const keyContactEmail = watch("keyContactEmail", "");
  const keyContactPhone = watch("keyContactPhone", "");

  const primaryColor = watch("primaryColor", "");
  const secondaryColor = watch("secondaryColor", "");
  const tertiaryColor = watch("tertiaryColor", "");
  const accentColor = watch("accentColor", "");

  const priorityLevel = watch("priorityLevel", "");

  const dateOfEstablishment = watch("dateOfEstablishment", "");
  const expiryDate = watch("expiryDate", "");
  const targetGoLive = watch("targetGoLive", "");

  const [isPrimaryLocation, setIsPrimaryLocation] = useState(true);
  const [isPrimaryContact, setIsPrimaryContact] = useState(true);
  const [isPrimaryKeyContact, setIsPrimaryKeyContact] = useState(true);

  const onSubmit = (data: SchoolProfileFormValues) => {
    onContinue(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold text-neutrals-900">School profile</h2>
      <p className="text-sm text-neutrals-500">
        Tell us about the school to get started.
      </p>

      <div className="mt-8 flex flex-col gap-8">
        <FormSectionCard title="School Identity">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField placeholder="School Name" register={register("schoolName")} value={schoolName} />
            <TextField
              placeholder="Enter display name"
              register={register("displayName")}
              value={displayName}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <SelectField
              placeholder="Select school type"
              options={["Primary", "Secondary", "Primary, Secondary"]}
              register={register("schoolType")}
              value={schoolType}
            />
            <SelectField
              placeholder="Select ownership type"
              options={["Private", "Public", "Government"]}
              register={register("ownershipType")}
              value={ownershipType}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField
              placeholder="Enter education authority"
              register={register("educationAuthority")}
              value={educationAuthority}
            />
            <CountrySelectField
              placeholder="Select country"
              fieldName="country"
              register={register("country")}
              value={country}
              setValue={setValue}
            />
          </div>

          <DateField
            placeholder="Enter date of establishment"
            fieldName="dateOfEstablishment"
            register={register("dateOfEstablishment")}
            value={dateOfEstablishment}
            setValue={setValue}
          />

          <TextareaField
            placeholder="Enter school description"
            register={register("description")}
            value={description}
          />
        </FormSectionCard>

        <FormSectionCard title="Registration number">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField
              placeholder="Enter registration number"
              register={register("registrationNumber")}
              value={registrationNumber}
            />
            <CountrySelectField
              placeholder="Select country"
              fieldName="regCountry"
              register={register("regCountry")}
              value={regCountry}
              setValue={setValue}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField
              placeholder="Enter issuing authority"
              register={register("issuingAuthority")}
              value={issuingAuthority}
            />
            <DateField
              placeholder="Enter expiry date"
              fieldName="expiryDate"
              register={register("expiryDate")}
              value={expiryDate}
              setValue={setValue}
            />
          </div>

          <button
            type="button"
            className="flex w-fit items-center gap-2 text-sm font-medium text-neutrals-700"
          >
            <AddSquare size={24} variant="Bulk" color="#5A5555" />
            Add another reg number
          </button>
        </FormSectionCard>

        <FormSectionCard title="Location">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField placeholder="Enter name" register={register("locationName")} value={locationName} />
            <TextField placeholder="Enter code" register={register("locationCode")} value={locationCode} />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField
              placeholder="Enter address line 1"
              register={register("addressLine1")}
              value={addressLine1}
            />
            <TextField placeholder="Enter city" register={register("city")} value={city} />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField placeholder="Enter state" register={register("state")} value={state} />
            <TextField
              placeholder="Enter postal code"
              register={register("postalCode")}
              value={postalCode}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField placeholder="Enter landmark" register={register("landmark")} value={landmark} />
            <TextField placeholder="Enter timezone" register={register("timezone")} value={timezone} />
          </div>

          <TextField
            placeholder="Enter student capacity"
            register={register("studentCapacity")}
            value={studentCapacity}
          />

          <ToggleField
            label="Set as primary location"
            checked={isPrimaryLocation}
            onChange={setIsPrimaryLocation}
          />

          <button
            type="button"
            className="flex w-fit items-center gap-2 text-sm font-medium text-neutrals-700"
          >
            <AddSquare size={24} variant="Bulk" color="#5A5555" />
            Add another location
          </button>
        </FormSectionCard>

        <FormSectionCard title="Contacts">
          <SelectField
            placeholder="Select contact type"
            options={["Phone", "Email", "Website", "Social media"]}
            register={register("contactType")}
            value={contactType}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField placeholder="Enter label" register={register("contactLabel")} value={contactLabel} />
            <TextField placeholder="Enter value" register={register("contactValue")} value={contactValue} />
          </div>

          <ToggleField
            label="Set as primary contact"
            checked={isPrimaryContact}
            onChange={setIsPrimaryContact}
          />

          <button
            type="button"
            className="flex w-fit items-center gap-2 text-sm font-medium text-neutrals-700"
          >
            <AddSquare size={24} variant="Bulk" color="#5A5555" />
            Add another contact
          </button>
        </FormSectionCard>

        <FormSectionCard title="Key Contacts">
          <SelectField
            placeholder="Select role type"
            options={["Principal", "Vice Principal", "Administrator", "IT Contact"]}
            register={register("keyContactRole")}
            value={keyContactRole}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField
              placeholder="Enter full name"
              register={register("keyContactFullName")}
              value={keyContactFullName}
            />
            <TextField
              placeholder="Enter role"
              register={register("keyContactRoleTitle")}
              value={keyContactRoleTitle}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <TextField
              placeholder="Enter email"
              register={register("keyContactEmail")}
              value={keyContactEmail}
            />
            <TextField
              placeholder="Enter phone number"
              register={register("keyContactPhone")}
              value={keyContactPhone}
            />
          </div>

          <ToggleField
            label="Set as primary contact"
            checked={isPrimaryKeyContact}
            onChange={setIsPrimaryKeyContact}
          />

          <button
            type="button"
            className="flex w-fit items-center gap-2 text-sm font-medium text-neutrals-700"
          >
            <AddSquare size={24} variant="Bulk" color="#5A5555" />
            Add another contact
          </button>
        </FormSectionCard>

        <FormSectionCard title="Color Code">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <ColorField
              placeholder="Primary school hex code color"
              textFieldName="primaryColor"
              textRegister={register("primaryColor")}
              colorRegister={register("primaryColorSwatch")}
              value={primaryColor}
              setValue={setValue}
            />
            <ColorField
              placeholder="Secondary school hex code color"
              textFieldName="secondaryColor"
              textRegister={register("secondaryColor")}
              colorRegister={register("secondaryColorSwatch")}
              value={secondaryColor}
              setValue={setValue}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <ColorField
              placeholder="Tertiary school hex code color"
              textFieldName="tertiaryColor"
              textRegister={register("tertiaryColor")}
              colorRegister={register("tertiaryColorSwatch")}
              value={tertiaryColor}
              setValue={setValue}
            />
            <ColorField
              placeholder="Accent school hex code color"
              textFieldName="accentColor"
              textRegister={register("accentColor")}
              colorRegister={register("accentColorSwatch")}
              value={accentColor}
              setValue={setValue}
            />
          </div>

          <button
            type="button"
            className="flex w-fit items-center gap-2 text-sm font-medium text-neutrals-700"
          >
            <AddSquare size={24} variant="Bulk" color="#5A5555" />
            Add another color
          </button>
        </FormSectionCard>

        <FormSectionCard title="Onboarding priority">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
            <SelectField
              placeholder="Select priority level"
              options={["Low", "Medium", "High", "Urgent"]}
              register={register("priorityLevel")}
              value={priorityLevel}
            />
            <DateField
              placeholder="Target go live"
              fieldName="targetGoLive"
              register={register("targetGoLive")}
              value={targetGoLive}
              setValue={setValue}
            />
          </div>
        </FormSectionCard>
      </div>

      <div className="mt-8 flex gap-6">
        <button
          type="button"
          className="flex h-13.5 flex-1 items-center justify-center gap-2.5 rounded-[28px] border border-primary px-8 py-4"
        >
          <span className="text-[16px] font-normal leading-[1.2] text-primary">Cancel</span>
        </button>
        <button
          type="submit"
          className="flex h-13.5 flex-1 items-center justify-center gap-2.5 rounded-[28px] border border-primary bg-primary px-8 py-4"
        >
          <span className="text-[16px] font-normal leading-[1.2] text-white">Continue</span>
        </button>
      </div>
    </form>
  );
};

export default SchoolProfileStep;