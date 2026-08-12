import { User } from "../users/users.type";

export interface CommentItem {
  id: string;
  feedbackId: string;
  userId: string;
  parentId?: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: Partial<User>;
  replies?: CommentItem[];
}
