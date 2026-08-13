import FeedbackFilters from "@/components/feedbacks/feedback-filters/feedback-filters";
import styles from "../../page.module.css";
import { Box, Typography, Chip, Paper } from "@mui/material";
import FeedbackCard from "@/components/feedbacks/feedback-card/feedback-card";
import { serverApi } from "@/utils/api/ssr-api";
import { Feedback } from "@/features/feedback/feedback.types";
import { User } from "@/features/users/users.type";
import SecurityIcon from "@mui/icons-material/Security";

export const dynamic = "force-dynamic";

interface AdminFeedbacksProps {
  searchParams: Promise<{
    search?: string;
    tags?: string | string[];
    authors?: string | string[];
    sort?: string;
    page?: string;
    limit?: string;
    includeDeleted?: string;
    includeDeletedComments?: string;
  }>;
}

function toArray(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

async function getAdminFeedbacks(searchParams: Awaited<AdminFeedbacksProps["searchParams"]>) {
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

  if (searchParams.includeDeleted === "true") {
    params.set("includeDeleted", "true");
  }
  if (searchParams.includeDeletedComments === "true") {
    params.set("includeDeletedComments", "true");
  }

  try {
    const apiInstance = await serverApi();
    const { data } = await apiInstance.get("/feedbacks", { params });
    if (data && data.data) {
      return data;
    }
  } catch (err) {
    console.error("Error loading admin feedbacks", err);
  }

  return {
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
  };
}

export default async function AdminFeedbacksPage({ searchParams }: AdminFeedbacksProps) {
  const params = await searchParams;
  const result = await getAdminFeedbacks(params);

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
      <FeedbackFilters isAdminView={true} />
      <Box className={styles.mainViewArea}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <SecurityIcon sx={{ color: "#38bdf8", fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Admin Feedback Overview
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                View-only mode. You cannot comment or vote on feedbacks.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {params.includeDeleted === "true" && (
              <Chip label="Showing Deleted Feedbacks" color="error" size="small" />
            )}
            {params.includeDeletedComments === "true" && (
              <Chip label="Showing Deleted Comments" color="warning" size="small" />
            )}
            <Chip
              label={`Total Feedbacks: ${result.meta.total}`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
            />
          </Box>
        </Paper>

        <Box className={styles.list}>
          {result.data.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
              <Typography color="textSecondary">
                No feedbacks found matching current filters.
              </Typography>
            </Paper>
          ) : (
            result.data.map((feedback: Feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                currentUser={user}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}
