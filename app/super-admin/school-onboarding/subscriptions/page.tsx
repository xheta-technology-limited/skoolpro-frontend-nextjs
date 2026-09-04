"use client";

import { useState } from "react";
import { AddSquare } from "iconsax-reactjs";
import DetailCard from "./_components/DetailCard";
import UpgradePlanModal from "./_components/UpgradePlanModal";
import BillingDetailsModal from "./_components/BillingDetailsModal";

import { useUserStore } from "@/features/school-profile/school-profile.store";
import { useGetSubscription } from "@/features/subscriptions/api/get-subscriptions";
import { titleCase } from "@/lib/helpers/string-to-title-case";

export default function SubscriptionsPage() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  const profile = useUserStore((state) => state.data);
  const schoolId = profile?.id ?? "";

  const { data: subscription } = useGetSubscription(schoolId);

  const activeModuleNames =
    subscription?.modules
      ?.filter((module) => module.is_active)
      .map((module) => titleCase(module.module_key))
      .join(", ") ?? "";

  const subscriptionFields = [
    { label: "Plan", value: subscription?.plan ?? "" },
    {
      label: "Billing",
      value: subscription?.billing_frequency
        ? titleCase(subscription.billing_frequency)
        : "",
    },
    {
      label: "Status",
      value: subscription?.status ? titleCase(subscription.status) : "",
    },
    {
      label: "Students",
      value: subscription?.limits.max_students?.toString() ?? "",
    },
    {
      label: "Staff",
      value: subscription?.limits.max_staff?.toString() ?? "",
    },
    {
      label: "Campuses",
      value: subscription?.limits.max_campuses?.toString() ?? "",
    },
    {
      label: "Storage",
      value: subscription
        ? `${subscription.limits.max_storage_mb / 1000} GB`
        : "",
    },
    { label: "Modules", value: activeModuleNames },
    { label: "Start Date", value: subscription?.starts_on ?? "" },
    { label: "End Date", value: subscription?.ends_on ?? "" },
  ];

  const billingFields = [
    {
      label: "Billing Contact Name",
      value: subscription?.billing_contact_name ?? "",
    },
    {
      label: "Billing Contact Phone",
      value: subscription?.billing_contact_phone ?? "",
    },
    {
      label: "Billing Contact Email",
      value: subscription?.billing_contact_email ?? "",
    },
    { label: "Billing Address", value: subscription?.billing_address ?? "" },
    {
      label: "Purchase Order Reference",
      value: subscription?.purchase_order_reference ?? "",
    },
    { label: "Tax Identifier", value: subscription?.tax_identifier ?? "" },
  ];

  function handleUpgradeSubscription() {
    setIsUpgradeModalOpen(true);
  }

  function handleEditBilling() {
    setIsBillingModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-6 p-5.5">
        <DetailCard
          title="Subscription"
          fields={subscriptionFields}
          onEdit={handleUpgradeSubscription}
          buttonLabel="Upgrade Plan"
          buttonIcon={<AddSquare size={16} variant="Bulk" color="#010081" />}

        />

        <DetailCard
          title="Billing details"
          fields={billingFields}
          onEdit={handleEditBilling}
          buttonLabel="Update"
        />

        <UpgradePlanModal
          open={isUpgradeModalOpen}
          onOpenChange={setIsUpgradeModalOpen}
          schoolId={schoolId}
          subscriptionId={subscription?.id ?? ""}
        />

        <BillingDetailsModal
          open={isBillingModalOpen}
          onOpenChange={setIsBillingModalOpen}
          subscriptionId={subscription?.id ?? ""}
          currentDetails={{
            billingContactName: subscription?.billing_contact_name ?? "",
            billingContactPhone: subscription?.billing_contact_phone ?? "",
            billingContactEmail: subscription?.billing_contact_email ?? "",
            billingAddress: subscription?.billing_address ?? "",
            purchaseOrderReference:
              subscription?.purchase_order_reference ?? "",
            taxIdentifier: subscription?.tax_identifier ?? "",
          }}
        />
    </div>
  );
}