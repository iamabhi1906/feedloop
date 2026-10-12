"use client";

import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import styles from "./table.module.css";
import { useAdminUsersContext } from "../../context/admin-users-context";
import UserTableRow from "./user-table-row";
import UserPagination from "../pagination/user-pagination";

export default function UserTable() {
  const { users, loading } = useAdminUsersContext();

  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table>
        <TableHead className={styles.tableHead}>
          <TableRow>
            <TableCell className={styles.headerCell}>User</TableCell>
            <TableCell className={styles.headerCell}>Role</TableCell>
            <TableCell className={styles.headerCell}>Status Flags</TableCell>
            <TableCell className={styles.actionsHeaderCell}>
              Admin Actions (Toggleable)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className={styles.loadingCell}>
                <CircularProgress size={32} />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={styles.loadingText}
                >
                  Loading users...
                </Typography>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className={styles.emptyCell}>
                <Typography color="textSecondary">
                  No users found matching query parameters.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => <UserTableRow key={user.id} user={user} />)
          )}
        </TableBody>
      </Table>

      <UserPagination />
    </TableContainer>
  );
}
