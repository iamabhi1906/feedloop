"use client";

import { Box, Pagination, Typography } from "@mui/material";
import styles from "./pagination.module.css";
import { useAdminUsersContext } from "../../context/admin-users-context";

export default function UserPagination() {
  const { page, totalPages, total, setPage } = useAdminUsersContext();

  return (
    <Box className={styles.paginationBar}>
      <Typography variant="body2" color="textSecondary">
        Showing Page {page} of {totalPages} ({total} total users)
      </Typography>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => setPage(value)}
        color="primary"
      />
    </Box>
  );
}
