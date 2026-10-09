"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import RecordTableSection, {
  type RecordTableRow,
} from "@/components/common/record-table-section/RecordTableSection";
import { Button } from "@/components/ui/custom-button";
import { Spinner } from "@/components/animations";
import { NoData } from "@/components/icons";
import { titleCase } from "@/lib/helpers/string-to-title-case";
import { toast } from "sonner";
import { useGetGuardian } from "@/features/user-management/guardian-management/api/get-guardian";
import type { GuardianStudentLink } from "@/features/user-management/guardian-management/types/guardian-detail-types";

import ViewMode from "./_components/view-mode";
import EditMode from "./_components/edit-mode";
import LinkStudentModal from "./_components/LinkStudentModal";
import { useDeleteGuardian } from "@/features/user-management/guardian-management/api/delete-guardian";
import { ApiError } from "@/lib/api";
import { useProgressRouter } from "@/features/page-loader";

function getStudentResponsibility(
  link: GuardianStudentLink["link"]
): string {
  if (link.authorised_to_collect) return "Authorized to collect";
  if (link.is_financially_responsible) return "Financial";
  if (link.can_make_decisions) return "Decision making";
  if (link.receives_academic_reports) return "Academic reports";
  if (link.receives_medical_info) return "Medical info";
  return "—";
}

export default function GuardianGeneralPage() {
  const params = useParams<{ guardianId: string }>();
  const guardianId = params.guardianId;
  const router = useProgressRouter();
  const [isEditMode, setEditMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [linkModal, setLinkModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<
    GuardianStudentLink | undefined
  >();
    const { mutate: deleteGuardian, isPending: isDeleting } = useDeleteGuardian();
  

  // ASSUMED — see top-of-file note #1. Path/hook name mirrors
  // get-student's own convention.
  const {
    data: guardian,
    isPending,
    error,
    isRefetching,
    refetch,
  } = useGetGuardian(guardianId);

  const onDelete = () => {
      deleteGuardian(
        { guardianId },
        {
          onSuccess: () => {
            toast.success("Guardian deleted successfully");
            router.push("/super-admin/user-management/parent-management");
          },
          onError: (err) => {
            if (!(err instanceof ApiError)) {
              toast.error(err.message || "Failed to delete guardian.");
            }
          },
        }
      );
    };

  if (isPending) {
    return (
      <div className="w-full flex items-center justify-center py-7">
        <Spinner size={70} />
      </div>
    );
  }

  if (error || !guardian) {
    return (
      <div className="w-fit mx-auto">
        <NoData
          variant="signal"
          title="Something went wrong"
          subTitle={error?.message || ""}
          className="w-97.5 h-143.75"
        />
        <Button
          className="mt-3 w-full"
          loading={isRefetching}
          onClick={() => refetch()}
          size="lg"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {isEditMode ? (
        <EditMode
          guardian={guardian}
          onCancel={() => setEditMode(false)}
          onSaved={() => setEditMode(false)}
        />
      ) : (
        <ViewMode guardian={guardian} onEdit={() => setEditMode(true)} />
      )}

      <RecordTableSection
        title="Linked Student"
        columns={[
          { key: "name", label: "Name" },
          { key: "relationship", label: "Relationship" },
          { key: "status", label: "Status" },
          { key: "responsibilities", label: "Responsibilities" },
        ]}
        rows={guardian.students.map(
          (student): RecordTableRow => ({
            id: student.id,
            cells: {
              name: student.full_name,
              relationship: titleCase(student.link.relationship),
              status: student.link.is_primary_contact
                ? "Primary"
                : "Secondary",
              responsibilities: getStudentResponsibility(student.link),
            },
          })
        )}
        onAdd={() => {
          setEditingStudent(undefined);
          setLinkModal(true);
        }}
        onEditRow={(rowOrId: string | { id: string }) => {
          const id = typeof rowOrId === "string" ? rowOrId : rowOrId.id;
          const student = guardian.students.find((s) => s.id === id);
          if (student) {
            setEditingStudent(student);
            setLinkModal(true);
          }
        }}
        addLabel="Link student"
        requireAtLeastOne={false}
        emptyLabel="No students linked yet."
      />

      <LinkStudentModal
        key={editingStudent?.id ?? "new"}
        open={linkModal}
        onOpenChange={setLinkModal}
        guardianId={guardianId}
        editingStudent={editingStudent}
      />


      <Button
        variant="secondary"
        className="mx-auto text-[13px] font-medium text-error-200! border-error-200!"
        onClick={() => setDeleteModal(true)}
      >
        Delete user account
      </Button>

      {/* Wire your existing FormModal here for delete confirmation */}
      {deleteModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDeleteModal(false)}
        >
          <div
            className="rounded-ml bg-white p-6 flex flex-col gap-4 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Delete this guardian account?</span>
            <div className="flex items-center justify-between">
              <Button onClick={() => setDeleteModal(false)}>No</Button>
              <Button
                variant="secondary"
                loading={isDeleting}
                onClick={onDelete}
                className="border-error-200! text-error-200!"
              >
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}