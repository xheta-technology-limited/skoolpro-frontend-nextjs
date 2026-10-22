import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { commentKeys } from "./query-keys";
import type { CreateCommentFormData } from "../schemas/create-comment-schema";
import { ServerErrorResponse } from "@/types/api";
import { CommentBankEntry } from "../types/api/comment-bank-entry";

export const createComment = (
  data: CreateCommentFormData
): Promise<CommentBankEntry> => {
  return api.post("comment-bank-entries", data);
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<CommentBankEntry, ServerErrorResponse, CreateCommentFormData>(
    {
      mutationFn: (data) => {
        return createComment(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: commentKeys.all });
      },
    }
  );
};
