"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import styles from "./feedback-card.module.css";
import { Feedback } from "@/features/feedback/feedback.types";
import { VoteType } from "@/features/vote/vote.types";
import { voteFeedback } from "@/features/vote/vote.service";
import axios from "axios";
import { User } from "@/features/users/users.type";

interface FeedbackCardProps {
  feedback: Feedback;
  onVote?: (feedbackId: string, type: VoteType) => Promise<void>;
  showFullDescription?: boolean;
  currentUser: User | null;
}

export default function FeedbackCard({
  feedback,
  onVote,
  showFullDescription = false,
  currentUser,
}: FeedbackCardProps) {
  const router = useRouter();
  const [vote, setVote] = useState<VoteType | null>(feedback.userVote ?? null);
  const [score, setScore] = useState<number>(feedback.score ?? 0);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVote(feedback.userVote ?? null);
    setScore(feedback.score ?? 0);
  }, [feedback.userVote, feedback.score]);

  const handleVote = async (type: VoteType) => {
    if (voting) return;
    const previousVote = vote;
    const previousScore = score;
    let newVote: VoteType | null = type;
    let newScore = previousScore;
    if (previousVote === type) {
      newVote = null;
      newScore = type === "UPVOTE" ? previousScore - 1 : previousScore + 1;
    } else {
      newVote = type;
      if (!previousVote) {
        newScore = type === "UPVOTE" ? previousScore + 1 : previousScore - 1;
      } else {
        newScore = type === "UPVOTE" ? previousScore + 2 : previousScore - 2;
      }
    }
    setVote(newVote);
    setScore(newScore);
    try {
      setVoting(true);
      if (onVote) {
        await onVote(feedback.id, type);
      } else {
        const res = await voteFeedback(feedback.id, type);
        if (res) {
          setVote(res.userVote ?? null);
          setScore(res.score);
        }
      }
    } catch (error: unknown) {
      setVote(previousVote);
      setScore(previousScore);
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 401) {
          router.push("/login");
        }
      }
    } finally {
      setVoting(false);
    }
  };

  return (
    <Box className={styles.card}>
      <Box className={styles.voteSection}>
        <IconButton
          className={`${styles.voteButton} ${
            vote === "UPVOTE" ? styles.activeUpvote : ""
          }`}
          onClick={() => handleVote("UPVOTE")}
          disabled={voting || !currentUser}
          aria-label="upvote"
        >
          <ArrowUpwardRoundedIcon />
        </IconButton>
        <Typography className={styles.score}>{score}</Typography>
        <IconButton
          className={`${styles.voteButton} ${
            vote === "DOWNVOTE" ? styles.activeDownvote : ""
          }`}
          onClick={() => handleVote("DOWNVOTE")}
          disabled={voting || !currentUser}
          aria-label="downvote"
        >
          <ArrowDownwardRoundedIcon />
        </IconButton>
      </Box>
      <Box className={styles.content}>
        <Box className={styles.header}>
          <Typography
            component={Link}
            href={`/feedback/${feedback.id}`}
            className={styles.title}
          >
            {feedback.title}
          </Typography>
          <Typography className={styles.author}>
            by @{feedback.user?.name ?? "unknown"}
          </Typography>
        </Box>

        <Typography
          className={`${styles.description} ${showFullDescription ? "" : styles.ThreeLineClap}`}
        >
          {feedback.description}
        </Typography>

        <Box className={styles.tags}>
          {feedback.tags?.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              size="small"
              className={styles.tag}
            />
          ))}
        </Box>

        <Box className={styles.footer}>
          <Box
            component={Link}
            href={`/feedback/${feedback.id}`}
            className={styles.comments}
          >
            <ChatBubbleOutlineRoundedIcon fontSize="small" />

            <Typography>
              {feedback.commentCount ?? 0}{" "}
              {(feedback.commentCount ?? 0) === 1 ? "comment" : "comments"}
            </Typography>
          </Box>

          <Typography className={styles.visibility}>
            {feedback.visibility}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
