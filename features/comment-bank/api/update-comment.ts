import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { commentKeys } from "./query-keys";
import type { CreateCommentFormData } from "../schemas/create-comment-schema";
import { ServerErrorResponse } from "@/types/api";

type UpdateCommentVariables = {
  commentId: string;
  data: CreateCommentFormData;
};

export const updateComment = ({
  commentId,
  data,
}: UpdateCommentVariables): Promise<null> => {
  return api.patch(`comment-bank-entries/${commentId}`, data);
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, UpdateCommentVariables>({
    mutationFn: (variables) => {
      return updateComment(variables);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
};
