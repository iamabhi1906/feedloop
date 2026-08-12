import { Tag } from "../tags/tag.types";
import { User } from "../users/users.type";
import { VoteType } from "../vote/vote.types";

export enum FeedbackVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

export interface Feedback {
  id: string;
  userId: string;
  title: string;
  description: string;
  visibility: FeedbackVisibility;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  tags: Tag[];
  score: number;
  userVote?: VoteType | null;
  commentCount?: number;
}
