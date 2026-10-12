"use client";

import { Alert, Snackbar } from "@mui/material";
import { useAdminUsersContext } from "../../context/admin-users-context";

export default function UserToast() {
  const { toast, closeToast } = useAdminUsersContext();

  return (
    <Snackbar open={toast.open} autoHideDuration={4000} onClose={closeToast}>
      <Alert severity={toast.severity} variant="filled">
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
