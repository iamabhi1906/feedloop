"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
import styles from "./comments.module.css";
import { CommentItem as CommentItemType } from "@/features/comments/comment.types";
import { createComment, deleteComment } from "@/features/comments/comment.service";

interface CommentItemProps {
  comment: CommentItemType;
  feedbackId: string;
  currentUserId?: string;
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
}

export default function CommentItem({
  comment,
  feedbackId,
  currentUserId,
  onCommentAdded,
  onCommentDeleted,
}: CommentItemProps) {
  const router = useRouter();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwnComment = Boolean(
    currentUserId && comment.userId === currentUserId,
  );

  const handleReplyClick = () => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    setShowReplyForm((prev) => !prev);
  };

  const handleSendReply = async () => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }
    if (!replyContent.trim() || submitting) return;

    try {
      setSubmitting(true);
      await createComment(feedbackId, replyContent.trim(), comment.id);
      setReplyContent("");
      setShowReplyForm(false);
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add reply", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwnComment || deleting) return;
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      setDeleting(true);
      await deleteComment(comment.id);
      onCommentDeleted();
    } catch (err) {
      console.error("Failed to delete comment", err);
    } finally {
      setDeleting(false);
    }
  };

  const authorName = comment.user?.name || comment.user?.username || "User";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const formattedDate = new Date(comment.createdAt).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <Box>
      <Box
        className={`${styles.commentCard} ${
          isOwnComment ? styles.ownComment : ""
        }`}
      >
        <Box className={styles.commentHeader}>
          <Box className={styles.authorMeta}>
            <Avatar sx={{ width: 28, height: 28, fontSize: "0.85rem" }}>
              {authorInitial}
            </Avatar>
            <Typography className={styles.authorName}>{authorName}</Typography>
            {isOwnComment && (
              <Chip label="You" size="small" className={styles.youBadge} />
            )}
            <Typography className={styles.time}>{formattedDate}</Typography>
          </Box>

          {isOwnComment && (
            <IconButton
              size="small"
              color="error"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="delete comment"
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Typography className={styles.content}>{comment.content}</Typography>

        <Box className={styles.footerActions}>
          <Button
            size="small"
            startIcon={<ReplyRoundedIcon fontSize="small" />}
            onClick={handleReplyClick}
            sx={{ textTransform: "none" }}
          >
            Reply
          </Button>
        </Box>

        {showReplyForm && (
          <Box className={styles.replyForm}>
            <TextField
              size="small"
              placeholder={`Replying to @${authorName}...`}
              multiline
              rows={2}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              fullWidth
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                size="small"
                variant="text"
                onClick={() => setShowReplyForm(false)}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={handleSendReply}
                disabled={submitting || !replyContent.trim()}
              >
                Post Reply
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Recursive rendering of nested replies for Self-Relations thread structure */}
      {comment.replies && comment.replies.length > 0 && (
        <Box className={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              feedbackId={feedbackId}
              currentUserId={currentUserId}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
