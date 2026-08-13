import FeedbackFilters from "@/components/feedbacks/feedback-filters/feedback-filters";
import styles from "./page.module.css";
import { Box, Button, Typography } from "@mui/material";
import FeedbackCard from "@/components/feedbacks/feedback-card/feedback-card";
import { serverApi } from "@/utils/api/ssr-api";
import { Feedback } from "@/features/feedback/feedback.types";

import { User } from "@/features/users/users.type";

export const dynamic = "force-dynamic";

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

  try {
    const apiInstance = await serverApi();
    const { data } = await apiInstance.get("/feedbacks/me", { params: params });
    if (data && data.data) {
      return data;
    }
  } catch {
    // fallback
  }

  return {
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const result = await getFeedbacks(params);
  let user: User | null = null;
  try {
    const api = await serverApi();
    const { data } = await api.get("/auth/me");
    user = data?.user ?? null;
  } catch {
    user = null;
  }
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
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              currentUser={user}
            />
          ))}
        </Box>

        <Typography variant="h1">Welcome to Feedloop</Typography>
      </Box>
    </Box>
  );
}
