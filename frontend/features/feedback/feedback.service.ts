import { FeedbackFormValues } from "@/app/(protected)/feedback/new/schema/feedback-form.schema";
import authApi from "@/utils/api/auth-api";

export interface FeedbackQueryParams {
  search?: string;
  tags?: string[];
  authors?: string[];
  sort?: string;
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
  includeDeletedComments?: boolean;
}

export async function createFeedback(data: FeedbackFormValues) {
  const { data: feedback } = await authApi.post("/feedbacks", data);
  if (!feedback) {
    throw new Error("Failed to create feedback");
  }
  return feedback;
}

export async function getFeedbacks(params: FeedbackQueryParams) {
  const { data } = await authApi.get("/feedbacks", { params });
  return data;
}
