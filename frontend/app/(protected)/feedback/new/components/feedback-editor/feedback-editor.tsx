"use client";
import { Box, TextField, Typography } from "@mui/material";
import styles from "./feedback-editor.module.css";
interface FeedbackEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function FeedbackEditor({
  value,
  onChange,
  error,
}: FeedbackEditorProps) {
  return (
    <Box className={styles.container}>
      <Typography className={styles.label}>Description</Typography>

      <TextField
        fullWidth
        multiline
        minRows={7}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Explain your feedback in detail..."
        error={Boolean(error)}
        helperText={error}
      />
    </Box>
  );
}
