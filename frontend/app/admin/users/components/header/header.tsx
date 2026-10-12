"use client";

import { Box, Chip, IconButton, Paper, Typography } from "@mui/material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import styles from "./header.module.css";
import { useAdminUsersContext } from "../../context/admin-users-context";

export default function Header() {
  const { total, fetchUsers } = useAdminUsersContext();

  return (
    <Paper elevation={0} className={styles.headerCard}>
      <Box className={styles.titleArea}>
        <PeopleRoundedIcon className={styles.icon} />
        <Typography className={styles.title}>User Management</Typography>
      </Box>
      <Box className={styles.actionsArea}>
        <Chip
          label={`Total Users: ${total}`}
          color="primary"
          variant="outlined"
        />
        <IconButton onClick={fetchUsers} title="Refresh Users">
          <RefreshRoundedIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
