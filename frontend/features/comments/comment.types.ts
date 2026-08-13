import { User } from "../users/users.type";

export interface CommentItem {
  id: string;
  feedbackId: string;
  userId: string;
  parentId?: string | null;
  content: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  user: Partial<User>;
  replies?: CommentItem[];
}
