import { toast } from "sonner";

import { ApiError } from "@/lib/api";

// Small helpers shared by the Owner Document and Review queue screens.

// Toast a failed request's message. ApiError is already surfaced by the
// api client (the other pages skip it the same way), so only other
// errors are toasted here.
export function notifyError(error: unknown, fallback: string) {
  if (error instanceof ApiError) return;
  toast.error(
    error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : fallback
  );
}

// Badge colours from the design, keyed by a normalised status value.
// The status values are confirmed (see DocumentVerificationStatus); the
// colours for rejected / superseded aren't in the designs, so they're
// picked to fit. Unknown values still fall back to grey.
const STATUS_STYLES: Record<string, { label: string; bg: string; text: string }> =
  {
    not_required: { label: "Not required", bg: "#E5E5E5", text: "#6B6B6B" },
    verified: { label: "Verified", bg: "#DDF5EE", text: "#0B7B69" },
    pending: { label: "Pending", bg: "#FDEBD3", text: "#CC7914" },
    under_review: { label: "Under review", bg: "#DCEEFF", text: "#0088FF" },
    expired: { label: "Expired", bg: "#FBE0E3", text: "#8C1823" },
    rejected: { label: "Rejected", bg: "#FBE0E3", text: "#8C1823" },
    superseded: { label: "Superseded", bg: "#E5E5E5", text: "#6B6B6B" },
    suspended: { label: "Suspended", bg: "#E5E5E5", text: "#4B4B4B" },
  };

const normaliseStatus = (status: string) =>
  status.trim().toLowerCase().replace(/[\s-]+/g, "_");

// "registration_certificate" -> "Registration certificate"
export const humanise = (key: string) =>
  key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

// "RESTRICTED" / "restricted" -> "Restricted"
export const titleCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

// "2026-11-01" or an ISO datetime -> "01/11/2026". A plain date is
// split rather than parsed, so it can't shift a day with the timezone.
export function formatDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }
  return new Date(value).toLocaleDateString("en-GB");
}

export function StatusBadge({ status }: { status: string | undefined }) {
  const key = status ? normaliseStatus(status) : "not_required";
  const style = STATUS_STYLES[key] ?? {
    ...STATUS_STYLES.not_required,
    label: humanise(key),
  };

  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-normal"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}

// ---------------------------------------------------------------------
// Detail-modal building blocks (used by the Owner Document and Review
// queue modals)
// ---------------------------------------------------------------------

// Inner field: 55px tall, 8px padding, 8px radius, 1px #F0EBFB border,
// 8px between the label and the value.
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[55px] min-w-0 flex-col justify-center gap-2 rounded-[8px] border border-[#F0EBFB] bg-white p-2">
      <span className="text-[12px] leading-none text-neutrals-500">
        {label}
      </span>
      <span className="truncate text-[14px] leading-none text-neutrals-900">
        {value}
      </span>
    </div>
  );
}

// Field box: #F5F5FF, 16px radius, 8px padding, two fields side by side
// with an 8px gap (653 wide = 8 + 314.5 + 8 + 314.5 + 8 + 8 at the
// modal's default width, so each field comes out at 314.5).
export function InfoPair({
  left,
  right,
}: {
  left: [string, string];
  right: [string, string];
}) {
  return (
    <div className="grid grid-cols-1 gap-2 rounded-[16px] bg-[#F5F5FF] p-2 sm:grid-cols-2">
      <InfoCard label={left[0]} value={left[1]} />
      <InfoCard label={right[0]} value={right[1]} />
    </div>
  );
}

// The same field box holding a single full-width field.
export function InfoSingle({ field }: { field: [string, string] }) {
  return (
    <div className="rounded-[16px] bg-[#F5F5FF] p-2">
      <InfoCard label={field[0]} value={field[1]} />
    </div>
  );
}

// A timeline entry. `done` steps get the filled marker; pending ones a
// hollow grey ring.
export function TimelineStep({
  label,
  date,
  done = true,
}: {
  label: string;
  date?: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      {done ? (
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9C97D6]">
          <span className="h-2 w-2 rounded-full bg-[#010081]" />
        </span>
      ) : (
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[#9F9C9C]">
          <span className="h-2 w-2 rounded-full border border-[#9F9C9C]" />
        </span>
      )}
      <div className="flex flex-col">
        <span className="text-[16px] text-neutrals-900">{label}</span>
        {date && <span className="text-[13px] text-neutrals-500">{date}</span>}
      </div>
    </div>
  );
}