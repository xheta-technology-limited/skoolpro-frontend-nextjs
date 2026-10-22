import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ServerErrorResponse } from "@/types/api";
import { commentKeys } from "./query-keys";

type DiscardCommentVariable = {
  commentId: string;
};

export const deleteComment = ({
  commentId,
}: DiscardCommentVariable): Promise<null> => {
  return api.delete(`comment-bank-entries/${commentId}`);
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation<null, ServerErrorResponse, DiscardCommentVariable>({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
    },
  });
};
