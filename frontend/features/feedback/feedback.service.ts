import { FeedbackFormValues } from "@/app/(protected)/feedback/new/schema/feedback-form.schema";
import authApi from "@/utils/api/auth-api";

export async function createFeedback(data: FeedbackFormValues) {
  const { data: feedback } = await authApi.post("/feedbacks", data);
  if (!feedback) {
    throw new Error("Failed to create feedback");
  }
  return feedback;
}
