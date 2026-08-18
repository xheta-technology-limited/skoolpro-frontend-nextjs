"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddSquare, Trash } from "iconsax-reactjs";
import {
  schoolProfileInputSchema,
  type SchoolProfileFormInput,
} from "@/features/onboarding/school-profile-schema";
import { type SchoolProfileFormValues } from "@/features/onboarding/school-profile-schema";
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
  emptyCampus,
  emptyContact,
  emptyKeyContact,
} from "./fields/constants";
import CountrySelectField from "./fields/CountrySelectField";

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
  const methods = useForm<SchoolProfileFormInput>({
    resolver: zodResolver(schoolProfileInputSchema),
    defaultValues: {
      ...defaultValues,
      school: defaultValues?.school
        ? {
            ...defaultValues.school,
            education_authorities: Array.isArray(
              defaultValues.school.education_authorities
            )
              ? defaultValues.school.education_authorities.join(", ")
              : defaultValues.school.education_authorities ?? "",
          }
        : undefined,
      registration_numbers: defaultValues?.registration_numbers ?? [
        emptyRegistration,
      ],
      campuses: defaultValues?.campuses ?? [emptyCampus],
      contacts: defaultValues?.contacts ?? [emptyContact],
      key_contacts: defaultValues?.key_contacts ?? [emptyKeyContact],
    },
  });

  const { handleSubmit, watch, setValue, control } = methods;

  const registrationArray = useFieldArray({
    control,
    name: "registration_numbers",
  });
  const campusArray = useFieldArray({ control, name: "campuses" });
  const contactArray = useFieldArray({ control, name: "contacts" });
  const keyContactArray = useFieldArray({ control, name: "key_contacts" });

  const campuses = watch("campuses") ?? [];
  const contacts = watch("contacts") ?? [];

  function setPrimaryCampus(index: number) {
    campuses.forEach((_, i) => {
      setValue(`campuses.${i}.is_primary`, i === index);
    });
  }

  function setPrimaryContact(index: number) {
    contacts.forEach((_, i) => {
      setValue(`contacts.${i}.is_primary`, i === index);
    });
  }

  const campusesHasPrimary = campuses.some((c) => c?.is_primary);
  const contactsHasPrimary = contacts.some((c) => c?.is_primary);

  useEffect(() => {
    if (campuses.length > 0 && !campusesHasPrimary) {
      setValue("campuses.0.is_primary", true);
    }
  }, [campuses.length, campusesHasPrimary, setValue]);

  useEffect(() => {
    if (contacts.length > 0 && !contactsHasPrimary) {
      setValue("contacts.0.is_primary", true);
    }
  }, [contacts.length, contactsHasPrimary, setValue]);

  const onSubmit = (data: SchoolProfileFormInput) => {
    const output: SchoolProfileFormValues = {
      ...data,
      school: {
        ...data.school,
        education_authorities: data.school.education_authorities
          ? data.school.education_authorities
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
      },
    };
    onContinue(output);
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
              <Input name="school.registered_name" label="School Name" />
              <Input name="school.display_name" label="Enter display name" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
              <div className="[&>div>button:first-child]:bg-[#F5F5FF]!">
                <Checkbox
                  name="type_slugs"
                  label="Select school type"
                  options={SCHOOL_TYPE_OPTIONS}
                />
              </div>
              <Select
                name="school.ownership_type"
                label="Select ownership type"
                options={OWNERSHIP_TYPE_OPTIONS}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
              <Input
                name="school.education_authorities"
                label="Enter education authorities (comma-separated)"
              />
              <Input name="school.motto" label="Enter school motto" />
            </div>

            <DatePicker
              name="school.founding_date"
              label="Enter date of establishment"
            />

            <TextArea
              name="school.description"
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
                    name={`registration_numbers.${index}.number`}
                    label="Enter registration number"
                  />
                  <CountrySelectField
                    name={`registration_numbers.${index}.country_code`}
                    placeholder="Select country"
                  />
                </div>

                <Input
                  name={`registration_numbers.${index}.issuing_authority`}
                  label="Enter issuing authority"
                />
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

          <FormSectionCard title="Campus">
            {campusArray.fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-6">
                {index > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutrals-700">
                      Campus {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => campusArray.remove(index)}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-neutrals-100"
                    >
                      <Trash size={18} variant="Bulk" color="#E4626F" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`campuses.${index}.name`}
                    label="Enter campus name"
                  />
                  <Input
                    name={`campuses.${index}.address_line_1`}
                    label="Enter address line 1"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input name={`campuses.${index}.city`} label="Enter city" />
                  <Input
                    name={`campuses.${index}.state_province`}
                    label="Enter state"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <CountrySelectField
                    name={`campuses.${index}.country_code`}
                    placeholder="Select country"
                  />

                  <Input
                    name={`campuses.${index}.timezone`}
                    label="Enter timezone"
                  />
                </div>

                <Input
                  name={`campuses.${index}.student_capacity`}
                  label="Enter student capacity"
                />

                <ToggleField
                  label="Set as primary campus"
                  checked={Boolean(campuses[index]?.is_primary)}
                  onChange={() => setPrimaryCampus(index)}
                  disabled={campuses.length === 1}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => campusArray.append(emptyCampus)}
              className="flex w-fit items-center gap-2 text-sm font-medium text-neutrals-700"
            >
              <AddSquare size={24} variant="Bulk" color="#5A5555" />
              Add another campus
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
                  name={`contacts.${index}.type`}
                  label="Select contact type"
                  options={CONTACT_TYPE_OPTIONS}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input name={`contacts.${index}.label`} label="Enter label" />
                  <Input name={`contacts.${index}.value`} label="Enter value" />
                </div>

                <ToggleField
                  label="Set as primary contact"
                  checked={Boolean(contacts[index]?.is_primary)}
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
                  name={`key_contacts.${index}.role_type`}
                  label="Select role type"
                  options={ROLE_TYPE_OPTIONS}
                />

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`key_contacts.${index}.full_name`}
                    label="Enter full name"
                  />
                  <Input
                    name={`key_contacts.${index}.job_title`}
                    label="Enter job title"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
                  <Input
                    name={`key_contacts.${index}.email`}
                    label="Enter email"
                  />
                  <Input
                    name={`key_contacts.${index}.phone`}
                    label="Enter phone number"
                  />
                </div>
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
                name="school.primary_color"
                label="Primary school hex code color"
              />
              <ColorField
                name="school.secondary_color"
                label="Secondary school hex code color"
              />
            </div>
          </FormSectionCard>

          <FormSectionCard title="Onboarding priority">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
              <Select
                name="onboarding.priority"
                label="Select priority level"
                options={PRIORITY_LEVEL_OPTIONS}
              />
              <DatePicker
                name="onboarding.target_go_live_date"
                label="Target go live"
              />
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
