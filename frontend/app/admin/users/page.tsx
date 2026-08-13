"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Chip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CommentBankRoundedIcon from "@mui/icons-material/CommentBankRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import styles from "./users.module.css";
import { User, UserRole } from "@/features/users/users.type";
import {
  getAdminUsers,
  updateUserActions,
} from "@/features/users/users.service";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers({ page, limit, search });
      setUsers(res.data || []);
      setTotal(res.meta?.total || 0);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setToast({
        open: true,
        message: "Failed to load user list",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleActionToggle = async (
    user: User,
    field: "isLoginDisabled" | "hideFeedbacks" | "hideComments",
    currentVal: boolean,
  ) => {
    if (user.role === UserRole.ADMIN && field === "isLoginDisabled") {
      setToast({
        open: true,
        message: "Cannot disable login for primary Admin account",
        severity: "error",
      });
      return;
    }

    const newVal = !currentVal;
    try {
      setUpdatingUserId(user.id);
      const updated = await updateUserActions(user.id, { [field]: newVal });

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...updated } : u)),
      );

      const fieldLabels: Record<string, string> = {
        isLoginDisabled: newVal ? "Login Disabled" : "Login Enabled",
        hideFeedbacks: newVal ? "Feedbacks Hidden" : "Feedbacks Visible",
        hideComments: newVal ? "Comments Hidden" : "Comments Visible",
      };

      setToast({
        open: true,
        message: `Action updated for @${user.username}: ${fieldLabels[field]}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Failed to update user actions", err);
      setToast({
        open: true,
        message: "Failed to update action for user",
        severity: "error",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <Box className={styles.container}>
      {/* Header Banner */}
      <Paper elevation={0} className={styles.headerCard}>
        <Box className={styles.titleArea}>
          <PeopleRoundedIcon sx={{ fontSize: 36, color: "#38bdf8" }} />
          <Box>
            <Typography className={styles.title}>User Management</Typography>
            <Typography className={styles.subtitle}>
              Manage user login access and toggle feedback or comment visibility.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip
            label={`Total Users: ${total}`}
            color="primary"
            variant="outlined"
            sx={{ color: "#ffffff", borderColor: "rgba(255,255,255,0.3)" }}
          />
          <IconButton
            onClick={fetchUsers}
            sx={{ color: "#ffffff" }}
            title="Refresh Users"
          >
            <RefreshRoundedIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Filter and Search Bar */}
      <Box className={styles.filterBar}>
        <TextField
          className={styles.searchField}
          placeholder="Search by name, username, or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
          size="small"
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows per page</InputLabel>
          <Select
            value={limit}
            label="Rows per page"
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* User Table */}
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status Flags</TableCell>
              <TableCell sx={{ fontWeight: 700, minWidth: 420 }}>
                Admin Actions (Toggleable)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} />
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Loading users...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Typography color="textSecondary">
                    No users found matching query parameters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isUpdating = updatingUserId === user.id;
                const isAdmin = user.role === UserRole.ADMIN;

                return (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: isAdmin ? "#0284c7" : "#64748b" }}>
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            @{user.username} • {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={user.role.toUpperCase()}
                        color={isAdmin ? "primary" : "default"}
                        size="small"
                        variant={isAdmin ? "filled" : "outlined"}
                      />
                    </TableCell>

                    <TableCell>
                      <Box className={styles.badgeStack}>
                        {user.isLoginDisabled && (
                          <Tooltip title="Login disabled for this user">
                            <Chip
                              icon={<BlockRoundedIcon fontSize="small" />}
                              label="Disabled Login"
                              color="error"
                              size="small"
                            />
                          </Tooltip>
                        )}
                        {user.hideFeedbacks && (
                          <Tooltip title="All feedbacks created by user are hidden">
                            <Chip
                              icon={<VisibilityOffRoundedIcon fontSize="small" />}
                              label="Hidden Feedbacks"
                              color="warning"
                              size="small"
                            />
                          </Tooltip>
                        )}
                        {user.hideComments && (
                          <Tooltip title="All comments by user are hidden">
                            <Chip
                              icon={<CommentBankRoundedIcon fontSize="small" />}
                              label="Hidden Comments"
                              color="secondary"
                              size="small"
                            />
                          </Tooltip>
                        )}
                        {!user.isLoginDisabled &&
                          !user.hideFeedbacks &&
                          !user.hideComments && (
                            <Chip label="Active" color="success" size="small" variant="outlined" />
                          )}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box className={styles.actionCell}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(user.isLoginDisabled)}
                              onChange={() =>
                                handleActionToggle(
                                  user,
                                  "isLoginDisabled",
                                  Boolean(user.isLoginDisabled),
                                )
                              }
                              disabled={isUpdating || isAdmin}
                              color="error"
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                              Disable Login
                            </Typography>
                          }
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(user.hideFeedbacks)}
                              onChange={() =>
                                handleActionToggle(
                                  user,
                                  "hideFeedbacks",
                                  Boolean(user.hideFeedbacks),
                                )
                              }
                              disabled={isUpdating}
                              color="warning"
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                              Hide Feedbacks
                            </Typography>
                          }
                        />

                        <FormControlLabel
                          control={
                            <Switch
                              checked={Boolean(user.hideComments)}
                              onChange={() =>
                                handleActionToggle(
                                  user,
                                  "hideComments",
                                  Boolean(user.hideComments),
                                )
                              }
                              disabled={isUpdating}
                              color="secondary"
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                              Hide Comments
                            </Typography>
                          }
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination Bar */}
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
      </TableContainer>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
