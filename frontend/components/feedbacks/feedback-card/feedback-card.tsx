"use client";

import Link from "next/link";
import { useState } from "react";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import styles from "./feedback-card.module.css";
import { Feedback } from "@/features/feedback/feedback.types";
import { VoteType } from "@/features/vote/vote.types";

interface FeedbackCardProps {
  feedback: Feedback;
  onVote?: (feedbackId: string, type: VoteType) => Promise<void>;
}

export default function FeedbackCard({ feedback, onVote }: FeedbackCardProps) {
  const [vote, setVote] = useState<VoteType | null>(feedback.userVote ?? null);

  const [score, setScore] = useState(feedback.score);
  const [voting, setVoting] = useState(false);

  const handleVote = async (type: VoteType) => {
    if (voting) return;

    const previousVote = vote;

    try {
      setVoting(true);

      if (previousVote === type) {
        setVote(null);

        setScore((current) => (type === "UPVOTE" ? current - 1 : current + 1));
      } else {
        setVote(type);
        setScore((current) => {
          if (!previousVote) {
            return type === "UPVOTE" ? current + 1 : current - 1;
          }
          return type === "UPVOTE" ? current + 2 : current - 2;
        });
      }

      await onVote?.(feedback.id, type);
    } catch {
      setVote(previousVote);
      setScore(feedback.score);
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
          disabled={voting}
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
          disabled={voting}
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
            by @{feedback.user.name}
          </Typography>
        </Box>

        <Typography className={styles.description}>
          {feedback.description}
        </Typography>

        <Box className={styles.tags}>
          {feedback.tags.map((tag) => (
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
              {feedback.commentCount}{" "}
              {feedback.commentCount === 1 ? "comment" : "comments"}
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
