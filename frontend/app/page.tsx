import FeedbackFilters from "@/components/feedbacks/feedback-filters/feedback-filters";
import styles from "./page.module.css";
import { Box, Button, Typography } from "@mui/material";
import FeedbackCard from "@/components/feedbacks/feedback-card/feedback-card";
import api from "@/utils/api/api";
import { Feedback } from "@/features/feedback/feedback.types";

interface HomeProps {
  searchParams: Promise<{
    search?: string;
    tags?: string | string[];
    authors?: string | string[];
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

function toArray(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

async function getFeedbacks(searchParams: Awaited<HomeProps["searchParams"]>) {
  const params = new URLSearchParams();

  if (searchParams.search) {
    params.set("search", searchParams.search);
  }

  toArray(searchParams.tags).forEach((tag) => {
    params.append("tags", tag);
  });

  toArray(searchParams.authors).forEach((author) => {
    params.append("authors", author);
  });

  params.set("sort", searchParams.sort ?? "desc");
  params.set("page", searchParams.page ?? "1");
  params.set("limit", searchParams.limit ?? "10");

  const { data } = await api.get("/feedbacks", { params: params });

  if (!data.data) {
    throw new Error("Failed to fetch feedbacks");
  }

  return data;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const result = await getFeedbacks(params);
  return (
    <Box className={styles.page}>
      <FeedbackFilters />
      <Box className={styles.mainViewArea}>
        <Box className={styles.header}>
          <Box>
            <Typography className={styles.title} color="secondary">
              Feedback
            </Typography>
            <Typography className={styles.subtitle} color="textSecondary">
              Total: {`${result.meta.total}`}
            </Typography>
          </Box>

          <Button
            href="/feedback/new"
            variant="contained"
            className={styles.createButton}
          >
            Create Feedback
          </Button>
        </Box>

        <Box className={styles.list}>
          {result.data.map((feedback: Feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </Box>

        <Typography variant="h1">Welcome to Feedloop</Typography>
      </Box>
    </Box>
  );
}
