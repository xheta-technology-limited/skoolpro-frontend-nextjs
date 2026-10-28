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

export type DocumentVerificationStatus =
  | "not_required"
  | "pending"
  | "under_review"
  | "verified"
  | "rejected"
  | "expired"
  | "superseded";

export type GetDocumentsParams = {
  purpose?: string;
  source?: DocumentSource;
  verification_status?: DocumentVerificationStatus;
  title?: string;
  confidentiality_level?: DocumentConfidentiality;
  page?: number;
  per_page?: number;
};

export interface DocumentRecord {
  id: string;
  documentable_type: string;
  documentable_id: string;
  owner: string;
  has_active_signature: boolean;
  purpose: string;
  source: DocumentSource;
  title: string | null;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  confidentiality_level: DocumentConfidentiality;
  expiry_date: string | null;
  is_expired: boolean;
  verification_status: DocumentVerificationStatus;
  verified_at: string | null;
  verified_by?: string | null;
  supersedes_document_id?: string | null;
  uploaded_by: string;
  notes: string | null;
  created_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface DocumentsPaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  last_page: number;
  path?: string;
  links?: PaginationLink[];
}

export interface DocumentsPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface GetDocumentsResponse {
  data: DocumentRecord[];
  meta: DocumentsPaginationMeta;
  links?: DocumentsPaginationLinks;
}

export interface UploadDocumentPayload {
  file: File;
  purpose: string;
  title?: string;
  confidentiality_level?: DocumentConfidentiality;
  expiry_date?: string;
}

export interface DocumentTypeRules {
  default_confidentiality: DocumentConfidentiality;
  requires_approval?: boolean;
  requires_signature?: boolean;
  expires?: boolean;
  renewal_lead_days?: number;
  required_signer_roles?: string[];
}

export type DocumentTypesMap = Record<string, DocumentTypeRules>;

export type GetReviewQueueParams = {
  purpose?: string;
  documentable_type?: string;
  verification_status?: DocumentVerificationStatus;
  page?: number;
  per_page?: number;
  title?: string;
};

export type DocumentReviewAction =
  | "submitted"
  | "claim"
  | "release"
  | "approve"
  | "reject"
  | "expire"
  | "supersede";

export interface DocumentReview {
  id: string;
  action: DocumentReviewAction;
  from_status: DocumentVerificationStatus | null;
  to_status: DocumentVerificationStatus;
  actor_id: string | null;
  note: string | null;
  created_at: string;
}

export interface ApproveDocumentPayload {
  note?: string;
}

export interface RejectDocumentPayload {
  reason: string;
}

export type SignatureMethod =
  | "typed"
  | "drawn"
  | "uploaded"
  | "click_to_sign";

export interface DocumentSignature {
  id: string;
  signer_name: string;
  signer_capacity: string | null;
  signer_user_id: string | null;
  method: SignatureMethod;
  has_image: boolean;
  statement: string | null;
  document_hash: string;
  signed_at: string;
  voided: boolean;
  voided_at: string | null;
  void_reason: string | null;
}

interface CaptureSignatureBase {
  signer_name: string;
  signer_capacity?: string;
  signer_user_id?: string;
}

export type CaptureSignaturePayload = CaptureSignatureBase &
  (
    | { method: "typed"; typed_signature: string }
    | { method: "drawn"; image: Blob }
    | { method: "uploaded"; image: File }
    | { method: "click_to_sign"; statement: string }
  );

export interface VoidSignaturePayload {
  reason: string;
}

export interface SignatureIntegrity {
  signature_id: string;
  intact: boolean;
}

export interface RenewDocumentPayload {
  file: File;
  title?: string;
  confidentiality_level?: DocumentConfidentiality;
  expiry_date?: string;
}
