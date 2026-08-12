import { notFound } from "next/navigation";
import { Box } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Link from "next/link";
import FeedbackCard from "@/components/feedbacks/feedback-card/feedback-card";
import CommentSection from "@/app/feedback/[id]/comments/comment-section";
import { serverApi } from "@/utils/api/ssr-api";
import { Feedback } from "@/features/feedback/feedback.types";
import { User } from "@/features/users/users.type";
import { CommentItem } from "@/features/comments/comment.types";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

interface FeedbackDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackDetailPage({
  params,
}: FeedbackDetailPageProps) {
  const { id } = await params;
  const api = await serverApi();

  let feedback: Feedback | null = null;
  let currentUser: User | null = null;
  let comments: CommentItem[] = [];

  try {
    const [feedbackRes, meRes, commentsRes] = await Promise.all([
      api.get(`/feedbacks/${id}`),
      api.get("/auth/me").catch(() => ({ data: null })),
      api.get(`/feedbacks/${id}/comments`).catch(() => ({ data: [] })),
    ]);

    feedback = feedbackRes.data;
    currentUser = meRes.data?.user ?? null;
    comments = commentsRes.data ?? [];
  } catch (err) {
    console.error("Failed to load feedback detail", err);
    notFound();
  }

  if (!feedback) {
    notFound();
  }

  return (
    <Box className={styles.page}>
      <Link href="/" className={styles.goBackButton}>
        <ArrowBackRoundedIcon />
        Back to Feedbacks
      </Link>

      <FeedbackCard
        feedback={feedback}
        showFullDescription={true}
        currentUser={currentUser}
      />

      <CommentSection
        feedbackId={feedback.id}
        initialComments={comments}
        currentUser={currentUser}
      />
    </Box>
  );
}
