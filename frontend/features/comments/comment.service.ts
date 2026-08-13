import authApi from "@/utils/api/auth-api";
import api from "@/utils/api/api";
import { CommentItem } from "./comment.types";

export async function getComments(
  feedbackId: string,
  includeDeletedComments?: boolean,
): Promise<CommentItem[]> {
  const { data } = await authApi.get(`/feedbacks/${feedbackId}/comments`, {
    params: { includeDeletedComments },
  });
  return data || [];
}

export async function createComment(
  feedbackId: string,
  content: string,
  parentId?: string,
): Promise<CommentItem> {
  const { data } = await authApi.post(`/feedbacks/${feedbackId}/comments`, {
    content,
    parentId,
  });
  return data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await authApi.delete(`/comments/${commentId}`);
}
