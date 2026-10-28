
const API_BASE_PATH = "/api/v1";

export const getDocumentDownloadUrl = (documentId: string): string =>
  `${API_BASE_PATH}/documents/${documentId}/download`;

export const openDocumentDownload = (documentId: string): void => {
  window.open(getDocumentDownloadUrl(documentId), "_blank", "noopener");
};