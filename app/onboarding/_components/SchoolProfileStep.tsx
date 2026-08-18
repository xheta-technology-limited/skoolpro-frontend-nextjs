"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddSquare, Trash } from "iconsax-reactjs";
import {
  schoolProfileSchema,
  type SchoolProfileFormValues,
} from "@/features/auth/schemas";
import {
  Input,
  Select,
  TextArea,
  DatePicker,
  Checkbox,
} from "@/components/ui/form";
import { africanCountries } from "@/lib/utils/countries-list";
import FormSectionCard from "./FormSectionCard";
import ToggleField from "./fields/ToggleField";
import ColorField from "./fields/ColorField";
import {
  SCHOOL_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
  CONTACT_TYPE_OPTIONS,
  ROLE_TYPE_OPTIONS,
  PRIORITY_LEVEL_OPTIONS,
  emptyRegistration,
  emptyLocation,
  emptyContact,
  emptyKeyContact,
  emptyCustomColor,
} from "./fields/constants";

export type { SchoolProfileFormValues };
export {
  SCHOOL_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
  CONTACT_TYPE_OPTIONS,
  ROLE_TYPE_OPTIONS,
  PRIORITY_LEVEL_OPTIONS,
} from "./fields/constants";

interface SchoolProfileStepProps {
  onContinue: (data: SchoolProfileFormValues) => void;
  onCancel?: () => void;
  defaultValues?: Partial<SchoolProfileFormValues>;
}

const SchoolProfileStep = ({
  onContinue,
  onCancel,
  defaultValues,
}: SchoolProfileStepProps) => {
  const methods = useForm<SchoolProfileFormValues>({
    resolver: zodResolver(schoolProfileSchema),
    defaultValues: {
      ...defaultValues,
      registrationNumbers: defaultValues?.registrationNumbers ?? [
        emptyRegistration,
      ],
      locations: defaultValues?.locations ?? [emptyLocation],
      contacts: defaultValues?.contacts ?? [emptyContact],
      keyContacts: defaultValues?.keyContacts ?? [emptyKeyContact],
      customColors: defaultValues?.customColors ?? [],
    },
  });

  const { handleSubmit, watch, setValue, control } = methods;

  const registrationArray = useFieldArray({
    control,
    name: "registrationNumbers",
  });
  const locationArray = useFieldArray({ control, name: "locations" });
  const contactArray = useFieldArray({ control, name: "contacts" });
  const keyContactArray = useFieldArray({ control, name: "keyContacts" });
  const customColorArray = useFieldArray({ control, name: "customColors" });

  const locations = watch("locations") ?? [];
  const contacts = watch("contacts") ?? [];
  const keyContacts = watch("keyContacts") ?? [];

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

  const locationsHasPrimary = locations.some((l) => l?.isPrimary);
  const contactsHasPrimary = contacts.some((c) => c?.isPrimary);
  const keyContactsHasPrimary = keyContacts.some((k) => k?.isPrimary);

  useEffect(() => {
    if (locations.length > 0 && !locationsHasPrimary) {
      setValue("locations.0.isPrimary", true);
    }
  }, [locations.length, locationsHasPrimary, setValue]);

  useEffect(() => {
    if (contacts.length > 0 && !contactsHasPrimary) {
      setValue("contacts.0.isPrimary", true);
    }
  }, [contacts.length, contactsHasPrimary, setValue]);

  useEffect(() => {
    if (keyContacts.length > 0 && !keyContactsHasPrimary) {
      setValue("keyContacts.0.isPrimary", true);
    }
  }, [keyContacts.length, keyContactsHasPrimary, setValue]);

  const onSubmit = (data: SchoolProfileFormValues) => {
    onContinue(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-lg font-semibold text-neutrals-900">
          School profile
        </h2>
        <p className="text-sm text-neutrals-500">
          This creates the school record and begins its onboarding in one step.
        </p>

        <div className="mt-8 flex flex-col gap-8">
          <FormSectionCard title="School Identity">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
              <Input name="schoolName" label="School Name" />
              <Input name="displayName" label="Enter display name" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
              <div className="[&>div>button:first-child]:bg-[#F5F5FF]!">
                <Checkbox
                  name="schoolType"
                  label="Select school type"
                  options={SCHOOL_TYPE_OPTIONS}
                />
              </div>
              <Select
                name="ownershipType"
                label="Select ownership type"
                options={OWNERSHIP_TYPE_OPTIONS}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
              <Input
                name="educationAuthority"
                label="Enter education authority"
              />
              <Select
                name="country"
                label="Select country"
                options={africanCountries}
                searchable
              />
            </div>

            <DatePicker
              name="dateOfEstablishment"
              label="Enter date of establishment"
            />

            <TextArea
              name="description"
              label="Enter school description"
              maxLength={200}
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
                  <Input
                    name={`registrationNumbers.${index}.registrationNumber`}
                    label="Enter registration number"
                  />
                  <Select
                    name={`registrationNumbers.${index}.regCountry`}
                    label="Select country"
                    options={africanCountries}
                    searchable
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`registrationNumbers.${index}.issuingAuthority`}
                    label="Enter issuing authority"
                  />
                  <DatePicker
                    name={`registrationNumbers.${index}.expiryDate`}
                    label="Enter expiry date"
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
                  <Input
                    name={`locations.${index}.locationName`}
                    label="Enter name"
                  />
                  <Input
                    name={`locations.${index}.locationCode`}
                    label="Enter code"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`locations.${index}.addressLine1`}
                    label="Enter address line 1"
                  />
                  <Input name={`locations.${index}.city`} label="Enter city" />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`locations.${index}.state`}
                    label="Enter state"
                  />
                  <Input
                    name={`locations.${index}.postalCode`}
                    label="Enter postal code"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`locations.${index}.landmark`}
                    label="Enter landmark"
                  />
                  <Input
                    name={`locations.${index}.timezone`}
                    label="Enter timezone"
                  />
                </div>

                <Input
                  name={`locations.${index}.studentCapacity`}
                  label="Enter student capacity"
                />

                <ToggleField
                  label="Set as primary location"
                  checked={Boolean(locations[index]?.isPrimary)}
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

                <Select
                  name={`contacts.${index}.contactType`}
                  label="Select contact type"
                  options={CONTACT_TYPE_OPTIONS}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`contacts.${index}.contactLabel`}
                    label="Enter label"
                  />
                  <Input
                    name={`contacts.${index}.contactValue`}
                    label="Enter value"
                  />
                </div>

                <ToggleField
                  label="Set as primary contact"
                  checked={Boolean(contacts[index]?.isPrimary)}
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

                <Select
                  name={`keyContacts.${index}.keyContactRole`}
                  label="Select role type"
                  options={ROLE_TYPE_OPTIONS}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`keyContacts.${index}.keyContactFullName`}
                    label="Enter full name"
                  />
                  <Input
                    name={`keyContacts.${index}.keyContactRoleTitle`}
                    label="Enter role"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`keyContacts.${index}.keyContactEmail`}
                    label="Enter email"
                  />
                  <Input
                    name={`keyContacts.${index}.keyContactPhone`}
                    label="Enter phone number"
                  />
                </div>

                <ToggleField
                  label="Set as primary contact"
                  checked={Boolean(keyContacts[index]?.isPrimary)}
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
                name="primaryColor"
                label="Primary school hex code color"
              />
              <ColorField
                name="secondaryColor"
                label="Secondary school hex code color"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
              <ColorField
                name="tertiaryColor"
                label="Tertiary school hex code color"
              />
              <ColorField
                name="accentColor"
                label="Accent school hex code color"
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
                  <Input
                    name={`customColors.${index}.colorName`}
                    label="Enter color name"
                  />
                  <ColorField
                    name={`customColors.${index}.colorValue`}
                    label="Enter hex code color"
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
              <Select
                name="priorityLevel"
                label="Select priority level"
                options={PRIORITY_LEVEL_OPTIONS}
              />
              <DatePicker name="targetGoLive" label="Target go live" />
            </div>
          </FormSectionCard>
        </div>

        <div className="mt-8 flex gap-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-13.5 flex-1 items-center justify-center gap-2.5 rounded-[28px] border border-primary px-8 py-4"
          >
            <span className="text-[16px] font-normal leading-[1.2] text-primary">
              Cancel
            </span>
          </button>
          <button
            type="submit"
            className="flex h-13.5 flex-1 items-center justify-center gap-2.5 rounded-[28px] border border-primary bg-primary px-8 py-4"
          >
            <span className="text-[16px] font-normal leading-[1.2] text-white">
              Continue
            </span>
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default SchoolProfileStep;