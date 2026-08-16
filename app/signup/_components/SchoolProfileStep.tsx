"use no memo";

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddSquare, Trash } from "iconsax-reactjs";
import { schoolProfileSchema, type SchoolProfileFormValues } from "@/features/auth/schemas";
import FormSectionCard from "./FormSectionCard";
import TextField from "./fields/TextField";
import SelectField from "./fields/SelectField";
import DateField from "./fields/DateField";
import TextareaField from "./fields/TextareaField";
import ToggleField from "./fields/ToggleField";
import ColorField from "./fields/ColorField";
import CountrySelectField from "./fields/CountrySelectField";

export type { SchoolProfileFormValues };

const emptyRegistration = {
  registrationNumber: "",
  regCountry: "",
  issuingAuthority: "",
  expiryDate: "",
};

const emptyLocation = {
  locationName: "",
  locationCode: "",
  addressLine1: "",
  city: "",
  state: "",
  postalCode: "",
  landmark: "",
  timezone: "",
  studentCapacity: "",
  isPrimary: false,
};

const emptyContact = {
  contactType: "",
  contactLabel: "",
  contactValue: "",
  isPrimary: false,
};

const emptyKeyContact = {
  keyContactRole: "",
  keyContactFullName: "",
  keyContactRoleTitle: "",
  keyContactEmail: "",
  keyContactPhone: "",
  isPrimary: false,
};

const emptyCustomColor = {
  colorName: "",
  colorValue: "",
  colorSwatch: "#FFFFFF",
};

interface SchoolProfileStepProps {
  onContinue: (data: SchoolProfileFormValues) => void;
  defaultValues?: Partial<SchoolProfileFormValues>;
}

const SchoolProfileStep = ({ onContinue, defaultValues }: SchoolProfileStepProps) => {
  const { register, handleSubmit, watch, setValue, control, formState } =
    useForm<SchoolProfileFormValues>({
      resolver: zodResolver(schoolProfileSchema),
      defaultValues: {
        registrationNumbers: [emptyRegistration],
        locations: [emptyLocation],
        contacts: [emptyContact],
        keyContacts: [emptyKeyContact],
        customColors: [],
        ...defaultValues,
      },
    });

  const errors = formState.errors;

  const schoolName = watch("schoolName", "");
  const displayName = watch("displayName", "") ?? "";
  const schoolType = watch("schoolType", "");
  const ownershipType = watch("ownershipType", "");
  const educationAuthority = watch("educationAuthority", "") ?? "";
  const country = watch("country", "");
  const description = watch("description", "") ?? "";
  const dateOfEstablishment = watch("dateOfEstablishment", "");

  const primaryColor = watch("primaryColor", "") ?? "";
  const secondaryColor = watch("secondaryColor", "") ?? "";
  const tertiaryColor = watch("tertiaryColor", "") ?? "";
  const accentColor = watch("accentColor", "") ?? "";

  const priorityLevel = watch("priorityLevel", "") ?? "";
  const targetGoLive = watch("targetGoLive", "") ?? "";

  const registrationArray = useFieldArray({ control, name: "registrationNumbers" });
  const locationArray = useFieldArray({ control, name: "locations" });
  const contactArray = useFieldArray({ control, name: "contacts" });
  const keyContactArray = useFieldArray({ control, name: "keyContacts" });
  const customColorArray = useFieldArray({ control, name: "customColors" });

  const registrations = watch("registrationNumbers");
  const locations = watch("locations");
  const contacts = watch("contacts");
  const keyContacts = watch("keyContacts");
  const customColors = watch("customColors");

  function setPrimaryLocation(index: number) {
    locations.forEach((_, i) => {
      setValue(`locations.${i}.isPrimary`, i === index);
    });
  }

  function setPrimaryContact(index: number) {
    contacts.forEach((_, i) => {
      setValue(`contacts.${i}.isPrimary`, i === index);
    });
  }

  function setPrimaryKeyContact(index: number) {
    keyContacts.forEach((_, i) => {
      setValue(`keyContacts.${i}.isPrimary`, i === index);
    });
  }

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
            <TextField
              placeholder="School Name"
              register={register("schoolName")}
              value={schoolName}
              error={errors.schoolName?.message}
            />
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
              error={errors.schoolType?.message}
            />
            <SelectField
              placeholder="Select ownership type"
              options={["Private", "Public", "Government"]}
              register={register("ownershipType")}
              value={ownershipType}
              error={errors.ownershipType?.message}
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
              error={errors.country?.message}
            />
          </div>

          <DateField
            placeholder="Enter date of establishment"
            fieldName="dateOfEstablishment"
            register={register("dateOfEstablishment")}
            value={dateOfEstablishment}
            setValue={setValue}
            error={errors.dateOfEstablishment?.message}
          />

          <TextareaField
            placeholder="Enter school description"
            register={register("description")}
            value={description}
          />
        </FormSectionCard>

        <FormSectionCard title="Registration number">
          {registrationArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-6">
              {index > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutrals-700">
                    Registration number {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => registrationArray.remove(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-neutrals-100"
                  >
                    <Trash size={18} variant="Bulk" color="#E4626F" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter registration number"
                  register={register(`registrationNumbers.${index}.registrationNumber`)}
                  value={registrations[index]?.registrationNumber ?? ""}
                  error={errors.registrationNumbers?.[index]?.registrationNumber?.message}
                />
                <CountrySelectField
                  placeholder="Select country"
                  fieldName={`registrationNumbers.${index}.regCountry`}
                  register={register(`registrationNumbers.${index}.regCountry`)}
                  value={registrations[index]?.regCountry ?? ""}
                  setValue={setValue}
                  error={errors.registrationNumbers?.[index]?.regCountry?.message}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter issuing authority"
                  register={register(`registrationNumbers.${index}.issuingAuthority`)}
                  value={registrations[index]?.issuingAuthority ?? ""}
                  error={errors.registrationNumbers?.[index]?.issuingAuthority?.message}
                />
                <DateField
                  placeholder="Enter expiry date"
                  fieldName={`registrationNumbers.${index}.expiryDate`}
                  register={register(`registrationNumbers.${index}.expiryDate`)}
                  value={registrations[index]?.expiryDate ?? ""}
                  setValue={setValue}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => registrationArray.append(emptyRegistration)}
            className="flex w-fit items-center gap-2 text-sm font-medium text-neutrals-700"
          >
            <AddSquare size={24} variant="Bulk" color="#5A5555" />
            Add another reg number
          </button>
        </FormSectionCard>

        <FormSectionCard title="Location">
          {locationArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-6">
              {index > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutrals-700">
                    Location {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => locationArray.remove(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-neutrals-100"
                  >
                    <Trash size={18} variant="Bulk" color="#E4626F" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter name"
                  register={register(`locations.${index}.locationName`)}
                  value={locations[index]?.locationName ?? ""}
                  error={errors.locations?.[index]?.locationName?.message}
                />
                <TextField
                  placeholder="Enter code"
                  register={register(`locations.${index}.locationCode`)}
                  value={locations[index]?.locationCode ?? ""}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter address line 1"
                  register={register(`locations.${index}.addressLine1`)}
                  value={locations[index]?.addressLine1 ?? ""}
                  error={errors.locations?.[index]?.addressLine1?.message}
                />
                <TextField
                  placeholder="Enter city"
                  register={register(`locations.${index}.city`)}
                  value={locations[index]?.city ?? ""}
                  error={errors.locations?.[index]?.city?.message}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter state"
                  register={register(`locations.${index}.state`)}
                  value={locations[index]?.state ?? ""}
                  error={errors.locations?.[index]?.state?.message}
                />
                <TextField
                  placeholder="Enter postal code"
                  register={register(`locations.${index}.postalCode`)}
                  value={locations[index]?.postalCode ?? ""}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter landmark"
                  register={register(`locations.${index}.landmark`)}
                  value={locations[index]?.landmark ?? ""}
                />
                <TextField
                  placeholder="Enter timezone"
                  register={register(`locations.${index}.timezone`)}
                  value={locations[index]?.timezone ?? ""}
                />
              </div>

              <TextField
                placeholder="Enter student capacity"
                register={register(`locations.${index}.studentCapacity`)}
                value={locations[index]?.studentCapacity ?? ""}
              />

              <ToggleField
                label="Set as primary location"
                checked={locations.length === 1 ? true : Boolean(locations[index]?.isPrimary)}
                onChange={() => setPrimaryLocation(index)}
                disabled={locations.length === 1}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => locationArray.append(emptyLocation)}
            className="flex w-fit items-center gap-2 text-sm font-medium text-neutrals-700"
          >
            <AddSquare size={24} variant="Bulk" color="#5A5555" />
            Add another location
          </button>
        </FormSectionCard>

        <FormSectionCard title="Contacts">
          {contactArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-6">
              {index > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutrals-700">
                    Contact {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => contactArray.remove(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-neutrals-100"
                  >
                    <Trash size={18} variant="Bulk" color="#E4626F" />
                  </button>
                </div>
              )}

              <SelectField
                placeholder="Select contact type"
                options={["Phone", "Email", "Website", "Social media"]}
                register={register(`contacts.${index}.contactType`)}
                value={contacts[index]?.contactType ?? ""}
                error={errors.contacts?.[index]?.contactType?.message}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter label"
                  register={register(`contacts.${index}.contactLabel`)}
                  value={contacts[index]?.contactLabel ?? ""}
                  error={errors.contacts?.[index]?.contactLabel?.message}
                />
                <TextField
                  placeholder="Enter value"
                  register={register(`contacts.${index}.contactValue`)}
                  value={contacts[index]?.contactValue ?? ""}
                  error={errors.contacts?.[index]?.contactValue?.message}
                />
              </div>

              <ToggleField
                label="Set as primary contact"
                checked={contacts.length === 1 ? true : Boolean(contacts[index]?.isPrimary)}
                onChange={() => setPrimaryContact(index)}
                disabled={contacts.length === 1}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => contactArray.append(emptyContact)}
            className="flex w-fit items-center gap-2 text-sm font-medium text-neutrals-700"
          >
            <AddSquare size={24} variant="Bulk" color="#5A5555" />
            Add another contact
          </button>
        </FormSectionCard>

        <FormSectionCard title="Key Contacts">
          {keyContactArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-6">
              {index > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutrals-700">
                    Key contact {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => keyContactArray.remove(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-neutrals-100"
                  >
                    <Trash size={18} variant="Bulk" color="#E4626F" />
                  </button>
                </div>
              )}

              <SelectField
                placeholder="Select role type"
                options={["Principal", "Vice Principal", "Administrator", "IT Contact"]}
                register={register(`keyContacts.${index}.keyContactRole`)}
                value={keyContacts[index]?.keyContactRole ?? ""}
              />

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter full name"
                  register={register(`keyContacts.${index}.keyContactFullName`)}
                  value={keyContacts[index]?.keyContactFullName ?? ""}
                />
                <TextField
                  placeholder="Enter role"
                  register={register(`keyContacts.${index}.keyContactRoleTitle`)}
                  value={keyContacts[index]?.keyContactRoleTitle ?? ""}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter email"
                  register={register(`keyContacts.${index}.keyContactEmail`)}
                  value={keyContacts[index]?.keyContactEmail ?? ""}
                  error={errors.keyContacts?.[index]?.keyContactEmail?.message}
                />
                <TextField
                  placeholder="Enter phone number"
                  register={register(`keyContacts.${index}.keyContactPhone`)}
                  value={keyContacts[index]?.keyContactPhone ?? ""}
                />
              </div>

              <ToggleField
                label="Set as primary contact"
                checked={keyContacts.length === 1 ? true : Boolean(keyContacts[index]?.isPrimary)}
                onChange={() => setPrimaryKeyContact(index)}
                disabled={keyContacts.length === 1}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => keyContactArray.append(emptyKeyContact)}
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

          {customColorArray.fields.map((field, index) => (
            <div key={field.id} className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutrals-700">
                  Custom color {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => customColorArray.remove(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-neutrals-100"
                >
                  <Trash size={18} variant="Bulk" color="#E4626F" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                <TextField
                  placeholder="Enter color name"
                  register={register(`customColors.${index}.colorName`)}
                  value={customColors[index]?.colorName ?? ""}
                />
                <ColorField
                  placeholder="Enter hex code color"
                  textFieldName={`customColors.${index}.colorValue`}
                  textRegister={register(`customColors.${index}.colorValue`)}
                  colorRegister={register(`customColors.${index}.colorSwatch`)}
                  value={customColors[index]?.colorValue ?? ""}
                  setValue={setValue}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => customColorArray.append(emptyCustomColor)}
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