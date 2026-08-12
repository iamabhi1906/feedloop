import { Box, Typography } from "@mui/material";
import styles from "./page.module.css";
import FeedbackForm from "./components/feedback-form/feedback-form";

export default function NewFeedbackPage() {
  return (
    <Box className={styles.page}>
      <Box className={styles.header}>
        <Typography className={styles.title}>Create Feedback</Typography>

        <Typography className={styles.subtitle}>
          Share an idea, report a problem, or suggest an improvement.
        </Typography>
      </Box>

      <FeedbackForm />
    </Box>
  );
}
