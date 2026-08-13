"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, TextField, Typography } from "@mui/material";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import styles from "./comments.module.css";
import { CommentItem as CommentItemType } from "@/features/comments/comment.types";
import { User } from "@/features/users/users.type";
import {
  createComment,
  getComments,
} from "@/features/comments/comment.service";
import CommentItem from "./comment-item";

interface CommentSectionProps {
  feedbackId: string;
  initialComments: CommentItemType[];
  currentUser?: User | null;
}

export default function CommentSection({
  feedbackId,
  initialComments,
  currentUser,
}: CommentSectionProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentItemType[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refreshComments = async () => {
    try {
      const updated = await getComments(feedbackId);
      setComments(updated);
    } catch (err) {
      console.error("Failed to refresh comments", err);
    }
  };

  const handleAddCommentClick = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (!newComment.trim() || submitting) return;
    try {
      setSubmitting(true);
      await createComment(feedbackId, newComment.trim());
      setNewComment("");
      await refreshComments();
    } catch (err) {
      console.error("Failed to add comment", err);
    } finally {
      setSubmitting(false);
    }
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <Box className={styles.section}>
      <Box className={styles.header}>
        <Typography className={styles.title}>Comments</Typography>
      </Box>
      <Box className={styles.addBox}>
        {isAdmin ? (
          <Typography color="textSecondary" sx={{ py: 1, fontStyle: "italic" }}>
            Admins are not allowed to comment on feedback. (View only)
          </Typography>
        ) : (
          <>
            <TextField
              placeholder={
                currentUser
                  ? "Share your thoughts or feedback..."
                  : "Login to add a comment..."
              }
              multiline
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onClick={() => {
                if (!currentUser) {
                  router.push("/login");
                }
              }}
              fullWidth
            />
            <Box className={styles.actions}>
              <Button
                variant="contained"
                startIcon={<AddCommentRoundedIcon />}
                onClick={handleAddCommentClick}
                disabled={
                  submitting || (Boolean(currentUser) && !newComment.trim())
                }
              >
                Add Comment
              </Button>
            </Box>
          </>
        )}
      </Box>
      <Box className={styles.threadList}>
        {comments.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
            No comments yet. Be the first to start the conversation!
          </Typography>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              feedbackId={feedbackId}
              currentUserId={currentUser?.id}
              onCommentAdded={refreshComments}
              onCommentDeleted={refreshComments}
            />
          ))
        )}
      </Box>
    </Box>
  );
}
