import { redirect } from "next/navigation";

// /super-admin/document-management has no content of its own — the tabs
// are separate routes, so land on the first one.
export default function DocumentManagementPage() {
  redirect("/super-admin/document-management/owner-document");
}