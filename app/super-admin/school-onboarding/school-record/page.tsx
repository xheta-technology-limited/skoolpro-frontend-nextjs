"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "iconsax-reactjs";

import { toast } from "sonner";
import { Button } from "@/components/ui/custom-button";
import { Input, Select, DatePicker, TextArea, Checkbox } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import RecordTableSection, {
  type RecordTableRow,
} from "./_components/RecordTableSection";
import AddRegistrationNumberModal from "./_components/AddRegistrationNumberModal";
import EditRegistrationNumberModal from "./_components/EditRegistrationNumberModal";
import AddLocationModal from "./_components/AddLocationModal";
import EditLocationModal from "./_components/EditLocationModal";
import AddContactModal from "./_components/AddContactModal";
import EditContactModal from "./_components/EditContactModal";
import AddKeyContactModal from "./_components/AddKeyContactModal";
import EditKeyContactModal from "./_components/EditKeyContactModal";
import EditColorCodeModal from "./_components/EditColorCodeModal";

import {
  schoolIdentitySchema,
  type SchoolIdentityFormValues,
} from "@/app/super-admin/school-onboarding/school-record/schema/school-record-schema";

import { useUserStore } from "@/features/school-profile/school-profile.store";
import { useGetSchoolProfile } from "@/features/school-profile/api/get-school-profile";
import { schoolProfileKeys } from "@/features/school-profile/api/query-keys";

import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { titleCase } from "@/lib/helpers/string-to-title-case";

import {
  SCHOOL_TYPE_OPTIONS,
  OWNERSHIP_TYPE_OPTIONS,
} from "@/app/onboarding/_components/SchoolProfileStep";

import type {
  UpdateRegistrationNumberPayload,
  UpdateSchoolProfilePayload,
} from "./types";

import { getAddress, getInitials, getPrimaryContact, getSchoolTypes, toDateOnly } from "./utils";
import CountrySelectField from "@/app/onboarding/_components/fields/CountrySelectField";

export default function SchoolRecordPage() {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [isAddRegistrationOpen, setIsAddRegistrationOpen] = useState(false);
  const [editingRegistrationId, setEditingRegistrationId] = useState<
    string | null
  >(null);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [editingCampusId, setEditingCampusId] = useState<string | null>(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(
    null
  );
  const [isAddKeyContactOpen, setIsAddKeyContactOpen] = useState(false);
  const [editingKeyContactId, setEditingKeyContactId] = useState<
    string | null
  >(null);
  const [isEditColorCodeOpen, setIsEditColorCodeOpen] = useState(false);

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
    { schoolId: string; data: UpdateSchoolProfilePayload }
  >({
    mutationFn: ({ schoolId, data }) => api.put(`schools/${schoolId}`, data),
  });

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
      api.put(`schools/${schoolId}/registration-numbers/${registrationId}`, data),
  });

  const deleteRegistrationMutation = useMutation<
    unknown,
    ServerErrorResponse,
    { schoolId: string; registrationId: string }
  >({
    mutationFn: ({ schoolId, registrationId }) =>
      api.delete(`schools/${schoolId}/registration-numbers/${registrationId}`),
  });

  async function handleDeleteRegistration(registrationId: string) {
    if (!profile?.id) {
      return;
    }

    try {
      await deleteRegistrationMutation.mutateAsync({
        schoolId: profile.id,
        registrationId,
      });
      await queryClient.invalidateQueries({ queryKey: schoolProfileKeys.all });
      toast.success("Registration number deleted.");
    } catch (error) {
      console.error("Failed to delete registration number:", error);
      toast.error("Failed to delete registration number. Please try again.");
    }
  }

  const deleteCampusMutation = useMutation<
    unknown,
    ServerErrorResponse,
    { schoolId: string; campusId: string }
  >({
    mutationFn: ({ schoolId, campusId }) =>
      api.delete(`schools/${schoolId}/campuses/${campusId}`),
  });

  async function handleDeleteLocation(campusId: string) {
    if (!profile?.id) {
      return;
    }

    try {
      await deleteCampusMutation.mutateAsync({
        schoolId: profile.id,
        campusId,
      });
      await queryClient.invalidateQueries({ queryKey: schoolProfileKeys.all });
      toast.success("Location deleted.");
    } catch (error) {
      console.error("Failed to delete location:", error);
      toast.error("Failed to delete location. Please try again.");
    }
  }

  const deleteContactMutation = useMutation<
    unknown,
    ServerErrorResponse,
    { schoolId: string; contactId: string }
  >({
    mutationFn: ({ schoolId, contactId }) =>
      api.delete(`schools/${schoolId}/contacts/${contactId}`),
  });

  async function handleDeleteContact(contactId: string) {
    if (!profile?.id) {
      return;
    }

    try {
      await deleteContactMutation.mutateAsync({
        schoolId: profile.id,
        contactId,
      });
      await queryClient.invalidateQueries({ queryKey: schoolProfileKeys.all });
      toast.success("Contact deleted.");
    } catch (error) {
      console.error("Failed to delete contact:", error);
      toast.error("Failed to delete contact. Please try again.");
    }
  }

  const deleteKeyContactMutation = useMutation<
    unknown,
    ServerErrorResponse,
    { schoolId: string; keyContactId: string }
  >({
    mutationFn: ({ schoolId, keyContactId }) =>
      api.delete(`schools/${schoolId}/key-contacts/${keyContactId}`),
  });

  async function handleDeleteKeyContact(keyContactId: string) {
    if (!profile?.id) {
      return;
    }

    try {
      await deleteKeyContactMutation.mutateAsync({
        schoolId: profile.id,
        keyContactId,
      });
      await queryClient.invalidateQueries({ queryKey: schoolProfileKeys.all });
      toast.success("Key contact deleted.");
    } catch (error) {
      console.error("Failed to delete key contact:", error);
      toast.error("Failed to delete key contact. Please try again.");
    }
  }

  const deletingRegistrationId = deleteRegistrationMutation.isPending
    ? (deleteRegistrationMutation.variables?.registrationId ?? null)
    : null;

  const deletingCampusId = deleteCampusMutation.isPending
    ? (deleteCampusMutation.variables?.campusId ?? null)
    : null;

  const deletingContactId = deleteContactMutation.isPending
    ? (deleteContactMutation.variables?.contactId ?? null)
    : null;

  const deletingKeyContactId = deleteKeyContactMutation.isPending
    ? (deleteKeyContactMutation.variables?.keyContactId ?? null)
    : null;

  const formValues = useMemo<SchoolIdentityFormValues>(() => {
    if (!profile) {
      return {
        schoolName: "",
        displayName: "",
        schoolTypes: [],
        ownershipType: "",
        issuingAuthority: "",
        countryCode: "",
        dateOfEstablishment: "",
        motto: "",
      };
    }

    const primaryRegistration = profile.registration_numbers?.[0];

    return {
      schoolName: profile.registered_name ?? "",
      displayName: profile.display_name ?? "",
      schoolTypes: getSchoolTypes(profile.types ?? []),
      ownershipType: profile.ownership_type ?? "",
      issuingAuthority: primaryRegistration?.issuing_authority ?? "",
      countryCode: primaryRegistration?.country_code ?? "",
      dateOfEstablishment: toDateOnly(profile.founding_date),
      motto: profile.motto ?? "",
    };
  }, [profile]);

  const methods = useForm<SchoolIdentityFormValues>({
    resolver: zodResolver(schoolIdentitySchema),
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

  function enterEditMode() {
    reset(formValues);
    setMode("edit");
  }

  const onSubmit = async (values: SchoolIdentityFormValues) => {
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
          motto: values.motto,
          type_slugs: values.schoolTypes,
        },
      });
      anySucceeded = true;
    } catch (error) {
      console.error("Failed to update school details:", error);
      failures.push("School details");
    }

    const registrationNumber = profile.registration_numbers?.[0];

    if (registrationNumber) {
      try {
        await updateRegistrationMutation.mutateAsync({
          schoolId: profile.id,
          registrationId: registrationNumber.id,
          data: {
            country_code: values.countryCode,
            number: registrationNumber.number,
            issuing_authority: values.issuingAuthority,
          },
        });
        anySucceeded = true;
      } catch (error) {
        console.error("Failed to update issuing authority/country:", error);
        failures.push("Registration details");
      } 
    } else {
      failures.push("Registration details");
    }

    if (anySucceeded) {
      await queryClient.invalidateQueries({ queryKey: schoolProfileKeys.all });
    }

    if (failures.length === 0) {
      toast.success("School identity updated successfully.");
      setMode("view");
      return;
    }

    if (anySucceeded) {
      toast.warning(
        `Some details were saved, but ${failures.join(", ")} failed to update. Please try again.`
      );
      return;
    }

    toast.error("Failed to update school identity. Please try again.");
  };

  const isSaving = isSubmitting || updateSchoolMutation.isPending || updateRegistrationMutation.isPending;

  if (!profile?.id) {
    return null;
  }

  const schoolId: string = profile.id;

  const schoolName = profile.registered_name || "School";
  const email = getPrimaryContact(profile.contacts ?? [], ["email"]);
  const address = getAddress(profile.campuses ?? []);

  const registrationRows: RecordTableRow[] = (profile.registration_numbers ?? []).map(
    (registration) => ({
      id: registration.id,
      cells: {
        number: registration.number,
        country: registration.country_code,
        authority: registration.issuing_authority,
        expiry: registration.expiry_date ?? "",
      },
    })
  );

  const locationRows: RecordTableRow[] = (profile.campuses ?? []).map((campus) => ({
    id: campus.id,
    cells: {
      address: campus.address_line_1 ?? "",
      city: campus.city,
      country: campus.country_code,
      postalCode: campus.postal_code ?? "",
    },
  }));
 const contactRows: RecordTableRow[] = (profile.contacts ?? []).map((contact) => ({
    id: contact.id,
    cells: {
      type: titleCase(contact.type),
      label: contact.label,
      value: contact.value,
      assigned: contact.is_primary ? "Primary" : "Secondary",
    },
  }));

   const keyContactRows: RecordTableRow[] = (profile.key_contacts ?? []).map((contact) => ({
    id: contact.id,
    cells: {
      role: titleCase(contact.role_type),
      name: contact.full_name,
      title: contact.job_title,
      email: contact.email,
    },
  }));

  const colorCodeRows: RecordTableRow[] = [
    {
      id: "brand-colors",
      cells: {
        primary: profile.primary_color ?? "",
        secondary: profile.secondary_color ?? "",
        accent: profile.accent_color ?? "",
        text: profile.text_color ?? "",
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-8">
      {mode === "view" && (
        <>
          <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1 [font-family:var(--font-inter)]">
            SCHOOL IDENTITY
          </span>

          <div className="flex min-h-41 w-full flex-col items-start justify-between gap-4 rounded-2xl border border-primary-100 bg-primary-bg px-4 py-6 lg:flex-row sm:items-center sm:px-12 sm:py-8">
            <div className="flex w-full min-w-0 items-center gap-4">
              <Avatar className="h-25 w-25 shrink-0">
                <AvatarFallback className="bg-neutrals-100">
                  {getInitials(schoolName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[24px] font-semibold leading-[1.2] text-primary-1000">
                  {schoolName}
                </span>

                <span className="text-[16px] font-normal leading-[1.2] text-neutrals-700">
                  {email}
                </span>

                <span className="text-[16px] font-normal leading-[1.2] text-neutrals-700">
                  {address}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={enterEditMode}
              leftIcon={<Edit size={24} variant="Bulk" color="#010081" />}
              className="w-full shrink-0 lg:w-32.25"
            >
              Edit
            </Button>
          </div>

          <RecordTableSection
            title="Registration number"
            columns={[
              { key: "number", label: "Registration number" },
              { key: "country", label: "Issuing country" },
              { key: "authority", label: "Issuing authority" },
              { key: "expiry", label: "Expiry date" },
            ]}
            rows={registrationRows}
            onAdd={() => setIsAddRegistrationOpen(true)}
            onEditRow={(rowId) => setEditingRegistrationId(rowId)}
            onDeleteRow={handleDeleteRegistration}
            deletingRowId={deletingRegistrationId}
            emptyLabel="No registration numbers added yet"
          />

          <RecordTableSection
            title="Location"
            columns={[
              { key: "address", label: "Address line" },
              { key: "city", label: "City" },
              { key: "country", label: "Country" },
              { key: "postalCode", label: "Postal Code" },
            ]}
            rows={locationRows}
            onAdd={() => setIsAddLocationOpen(true)}
            onEditRow={(rowId) => setEditingCampusId(rowId)}
            onDeleteRow={handleDeleteLocation}
            deletingRowId={deletingCampusId}
            emptyLabel="No locations added yet"
          />

          <RecordTableSection
            title="Contact"
            columns={[
              { key: "type", label: "Contact type" },
              { key: "label", label: "Label" },
              { key: "value", label: "Value" },
              { key: "assigned", label: "Assigned" },
            ]}
            rows={contactRows}
            onAdd={() => setIsAddContactOpen(true)}
            onEditRow={(rowId) => setEditingContactId(rowId)}
            onDeleteRow={handleDeleteContact}
            deletingRowId={deletingContactId}
            emptyLabel="No contacts added yet"
          />

          <RecordTableSection
            title="Key contact"
            columns={[
              { key: "role", label: "Role type" },
              { key: "name", label: "Full name" },
              { key: "title", label: "Role" },
              { key: "email", label: "Email" },
            ]}
            rows={keyContactRows}
            onAdd={() => setIsAddKeyContactOpen(true)}
            onEditRow={(rowId) => setEditingKeyContactId(rowId)}
            onDeleteRow={handleDeleteKeyContact}
            deletingRowId={deletingKeyContactId}
            emptyLabel="No key contacts added yet"
          />

          <RecordTableSection
            title="Color code"
            columns={[
              { key: "primary", label: "Primary color", isColor: true },
              { key: "secondary", label: "Secondary color", isColor: true },
              { key: "accent", label: "Tertiary color", isColor: true },
              { key: "text", label: "Accent color", isColor: true },
            ]}
            rows={colorCodeRows}
            onEditRow={() => setIsEditColorCodeOpen(true)}
          />
        </>
      )}

      {mode === "edit" && (
        <>
          <span className="text-[16px] font-normal leading-6 text-neutrals-text-body-light-1 [font-family:var(--font-inter)]">
            SCHOOL IDENTITY
          </span>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-4 rounded-2xl"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input name="schoolName" label="School name" />
                <Input name="displayName" label="Short name" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="[&>div>button:first-child]:bg-primary-bg!">
                  <Checkbox
                    name="schoolTypes"
                    label="School type"
                    options={SCHOOL_TYPE_OPTIONS}
                  />
                </div>

                <Select
                  name="ownershipType"
                  placeholder="Ownership type"
                  options={OWNERSHIP_TYPE_OPTIONS}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input name="issuingAuthority" label="Issuing authority" />
                <CountrySelectField name="countryCode" placeholder="Country" />
              </div>

              <DatePicker name="dateOfEstablishment" label="Date of establishment" />

              <TextArea name="motto" label="School motto" maxLength={200} />

              <div className="flex justify-end">
                <Button type="submit" loading={isSaving} size="lg">
                  {isSaving ? "Saving" : "Save"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </>
      )}

      <AddRegistrationNumberModal
        open={isAddRegistrationOpen}
        onOpenChange={setIsAddRegistrationOpen}
        schoolId={schoolId}
      />

      <EditRegistrationNumberModal
        open={editingRegistrationId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingRegistrationId(null);
          }
        }}
        schoolId={schoolId}
        registration={
          profile.registration_numbers?.find(
            (registration) => registration.id === editingRegistrationId
          ) ?? null
        }
      />

      <AddLocationModal
        open={isAddLocationOpen}
        onOpenChange={setIsAddLocationOpen}
        schoolId={schoolId}
        countryCode={
          profile.campuses?.[0]?.country_code ??
          profile.registration_numbers?.[0]?.country_code ??
          "NG"
        }
      />

      <EditLocationModal
        open={editingCampusId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCampusId(null);
          }
        }}
        schoolId={schoolId}
        campus={
          profile.campuses?.find(
            (campus) => campus.id === editingCampusId
          ) ?? null
        }
      />

      <AddContactModal
        open={isAddContactOpen}
        onOpenChange={setIsAddContactOpen}
        schoolId={schoolId}
      />

      <EditContactModal
        open={editingContactId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingContactId(null);
          }
        }}
        schoolId={schoolId}
        contact={
          profile.contacts?.find(
            (contact) => contact.id === editingContactId
          ) ?? null
        }
      />

      <AddKeyContactModal
        open={isAddKeyContactOpen}
        onOpenChange={setIsAddKeyContactOpen}
        schoolId={schoolId}
      />

      <EditKeyContactModal
        open={editingKeyContactId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingKeyContactId(null);
          }
        }}
        schoolId={schoolId}
        keyContact={
          profile.key_contacts?.find(
            (contact) => contact.id === editingKeyContactId
          ) ?? null
        }
      />

      <EditColorCodeModal
        open={isEditColorCodeOpen}
        onOpenChange={setIsEditColorCodeOpen}
        schoolId={schoolId}
        profile={{
          primary_color: profile.primary_color ?? null,
          secondary_color: profile.secondary_color ?? null,
          accent_color: profile.accent_color ?? null,
          text_color: profile.text_color ?? null,
        }}
      />
    </div>
  );
}