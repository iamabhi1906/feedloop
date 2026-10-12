"use client";

import { Box } from "@mui/material";
import styles from "./users.module.css";
import { AdminUsersProvider } from "./context/admin-users-context";
import Header from "./components/header/header";
import UserAdminFilter from "./components/filters/filter";
import UserTable from "./components/table/user-table";
import UserToast from "./components/toast/user-toast";

function AdminUsersContent() {
  return (
    <Box className={styles.container}>
      <Header />
      <UserAdminFilter />
      <UserTable />
      <UserToast />
    </Box>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminUsersProvider>
      <AdminUsersContent />
    </AdminUsersProvider>
  );
}
