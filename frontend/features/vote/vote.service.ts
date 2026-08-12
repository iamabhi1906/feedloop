import authApi from "@/utils/api/auth-api";
import { VoteType } from "./vote.types";

export async function voteFeedback(feedbackId: string, type: VoteType) {
  const { data } = await authApi.post<{
    userVote: VoteType | null;
    score: number;
  }>("/votes", { feedbackId, type });
  return data;
}
