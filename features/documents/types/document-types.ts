// GET /documentables/{type}/{id}/documents?purpose=&source=
// Newest first. The endpoint is paginated even though the spec doesn't
// show it, so the hook keeps the whole { data, meta } response
// (`raw: true`) instead of letting the api client unwrap to the array.

// Confirmed allow-list for the {type} segment — anything else is a 404
// "Unknown documentable type".
export type DocumentableType =
  | "school"
  | "enrolment"
  | "student"
  | "school-registration-number"
  | "school-authorised-signatory"
  | "staff"
  | "guardian";

export type DocumentSource = "uploaded" | "generated";

export type DocumentConfidentiality = "public" | "restricted" | "confidential";

// Confirmed by the approval / review reference. Applies to uploaded
// documents only — generated ones are trusted on creation ("verified").
// Terminal states (no way out): not_required, rejected, superseded.
export type DocumentVerificationStatus =
  | "not_required"
  | "pending"
  | "under_review"
  | "verified"
  | "rejected"
  | "expired"
  | "superseded";

// A `type` alias (not an interface) so it can be passed as the api
// client's `params`.
//
// UNCONFIRMED: `page`, `per_page` and `search` aren't in the spec —
// they're assumed to match the other paginated lists (guardians,
// students). Check `search` in particular against the real endpoint.
export type GetDocumentsParams = {
  purpose?: string; // exact match
  source?: DocumentSource;
  page?: number;
  per_page?: number;
  search?: string;
};

// Confirmed against a real list response. The api returns no file URL
// (only original_filename / mime_type / size_bytes) and no updated_at —
// created_at is the only timestamp besides verified_at.
//
// `verification_status` is now the full confirmed set (see above).
export interface DocumentRecord {
  id: string;
  documentable_type: string; // e.g. "School"
  documentable_id: string;
  purpose: string; // e.g. "letterhead"
  source: DocumentSource;
  title: string | null;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  confidentiality_level: DocumentConfidentiality;
  expiry_date: string | null; // "YYYY-MM-DD"
  is_expired: boolean;
  verification_status: DocumentVerificationStatus;
  verified_at: string | null;
  // In the approval reference's DocumentResource but not in the list
  // sample seen earlier, so optional.
  verified_by?: string | null;
  supersedes_document_id?: string | null;
  uploaded_by: string;
  notes: string | null;
  created_at: string; // ISO datetime
}

// Pagination meta — assumed to be the same Laravel shape the guardian
// list uses (only the fields the list screens read).
export interface DocumentsPaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface GetDocumentsResponse {
  data: DocumentRecord[];
  meta: DocumentsPaginationMeta;
}

// POST /documentables/{type}/{id}/documents (documents.upload) —
// multipart/form-data. 201 returns the created document
// (source "uploaded", status "pending").
export interface UploadDocumentPayload {
  file: File; // up to 20 MB (per-purpose limits may be tighter)
  // What the file is — e.g. "logo", "registration_certificate",
  // "letterhead", "signature". The full list isn't confirmed.
  purpose: string;
  title?: string;
  confidentiality_level?: DocumentConfidentiality; // server default: "restricted"
  expiry_date?: string; // date
}

// GET /documentables/types (documents.view) — the platform's document
// types and their rules, as an object keyed by the type's key (the same
// value sent as `purpose` on upload). The api client unwraps `data`.
// Every type has default_confidentiality; the other rules only appear
// on the types they apply to, so they're optional.
export interface DocumentTypeRules {
  default_confidentiality: DocumentConfidentiality;
  requires_approval?: boolean;
  requires_signature?: boolean;
  expires?: boolean;
  renewal_lead_days?: number;
  required_signer_roles?: string[];
}

export type DocumentTypesMap = Record<string, DocumentTypeRules>;

// ---------------------------------------------------------------------
// Review workflow
// ---------------------------------------------------------------------

// GET /documents/review-queue (documents.review) — uploaded documents
// awaiting review (pending / under_review), newest first, paginated
// like the other lists. `purpose` and `documentable_type` filter;
// `per_page` defaults to 25. `page` isn't listed but is assumed, as the
// response is paginated. A `type` alias (not interface) so it can be
// passed as the api client's `params`.
export type GetReviewQueueParams = {
  purpose?: string;
  documentable_type?: string;
  page?: number;
  per_page?: number;
};

export type DocumentReviewAction =
  | "submitted"
  | "claim"
  | "release"
  | "approve"
  | "reject"
  | "expire"
  | "supersede";

// One row of a document's append-only action history
// (GET /documents/{document}/reviews, newest first). `actor_id` is null
// for system actions (expire, supersede) — and it's only an id, there's
// no name on the row.
export interface DocumentReview {
  id: string;
  action: DocumentReviewAction;
  from_status: DocumentVerificationStatus | null;
  to_status: DocumentVerificationStatus;
  actor_id: string | null;
  note: string | null;
  created_at: string;
}

// POST /documents/{document}/approve (documents.verify)
export interface ApproveDocumentPayload {
  note?: string; // up to 500 characters
}

// POST /documents/{document}/reject (documents.verify)
export interface RejectDocumentPayload {
  reason: string; // required, up to 500 characters
}

// ---------------------------------------------------------------------
// Signatures
// ---------------------------------------------------------------------

export type SignatureMethod =
  | "typed"
  | "drawn"
  | "uploaded"
  | "click_to_sign";

// The stored image path is never exposed — `has_image` says whether one
// exists.
export interface DocumentSignature {
  id: string;
  signer_name: string;
  signer_capacity: string | null;
  signer_user_id: string | null;
  method: SignatureMethod;
  has_image: boolean;
  statement: string | null;
  document_hash: string; // SHA-256 of the signed file
  signed_at: string;
  voided: boolean;
  voided_at: string | null;
  void_reason: string | null;
}

interface CaptureSignatureBase {
  signer_name: string; // required, up to 150
  signer_capacity?: string; // e.g. "Authorised Signatory", "Guardian"
  signer_user_id?: string; // the signer's user id, when internal
}

// POST /documents/{document}/signatures (documents.sign). Each method
// needs its own field: typed -> typed_signature (up to 200), drawn and
// uploaded -> an image (up to 2 MB), click_to_sign -> statement (up to
// 1000). The image methods go as multipart. `ip_address` and
// `user_agent` are captured server-side.
export type CaptureSignaturePayload = CaptureSignatureBase &
  (
    | { method: "typed"; typed_signature: string }
    | { method: "drawn"; image: Blob }
    | { method: "uploaded"; image: File }
    | { method: "click_to_sign"; statement: string }
  );

// POST /documents/{document}/signatures/{signature}/void
export interface VoidSignaturePayload {
  reason: string; // required, up to 500
}

// GET /documents/{document}/signatures/{signature}/verify — false means
// the file changed after signing, or can't be read to confirm.
export interface SignatureIntegrity {
  signature_id: string;
  intact: boolean;
}

// ---------------------------------------------------------------------
// Renewal
// ---------------------------------------------------------------------

// POST /documents/{document}/renew (documents.upload) — multipart. The
// new document links to the one it renews and enters review (pending);
// approving it supersedes the old one.
export interface RenewDocumentPayload {
  file: File; // up to 20 MB
  title?: string; // up to 150
  confidentiality_level?: DocumentConfidentiality; // omit for the type default
  expiry_date?: string; // date; needed in practice for expiring types
}

// ---------------------------------------------------------------------
// Profile photo
// ---------------------------------------------------------------------

// POST /documentables/{type}/{id}/profile-photo — the path description
// lists student, staff and guardian as the owners that have one.
export type ProfilePhotoOwnerType = "student" | "staff" | "guardian";

// multipart/form-data. The file is limited to 5 MB (not the 20 MB of a
// normal document upload). `confidentiality_level` defaults to
// "restricted" on the server when omitted.
export interface SetProfilePhotoPayload {
  file: File;
  confidentiality_level?: DocumentConfidentiality;
}

// GET /documentables/{type}/{id}/profile-photo/url — a signed, temporary
// URL to the photo file (the api client unwraps `data`). It expires.
export interface ProfilePhotoUrl {
  url: string;
}