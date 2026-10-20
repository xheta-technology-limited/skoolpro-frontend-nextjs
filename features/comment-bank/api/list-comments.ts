import { api } from "@/lib/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ServerErrorResponse } from "@/types/api";
import { commentKeys } from "./query-keys";
import { CommentBankEntry } from "../types/api/comment-bank-entry";

export type ListCommentsParams = {
  type: string;
  education_level_id: string;
  [key: string]: string | undefined;
};

export const listComments = (
  params: ListCommentsParams
): Promise<CommentBankEntry[]> => {
  return api.get("comment-bank-entries", { params });
};

export const useListComments = (
  params: ListCommentsParams,
  options?: Partial<
    UseQueryOptions<CommentBankEntry[], ServerErrorResponse>
  >
) => {
  return useQuery<CommentBankEntry[], ServerErrorResponse>({
    queryFn: () => listComments(params),
    queryKey: commentKeys.filtered(params.type, params.education_level_id),
    ...options,
  });
};
